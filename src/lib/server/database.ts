import { MONGO_URL } from '$env/static/private';
import { LogType_enum } from '$lib/types';
import { MongoClient } from 'mongodb';

export const getDatabase = async () => {
	const client = await MongoClient.connect(MONGO_URL);
	const database = client.db('organiser');
	return database;
};

export const getCollection = async (collectionName: string) => {
	const db = await getDatabase();
	const collection = db.collection(collectionName);

	return collection;
};

const collection = await getCollection('aiacuone');

export const getLogs = async ({
	space,
	search,
	date,
	isCompleted,
	hasAnswer,
	important,
	todo,
	time,
	question
}: {
	space?: string;
	search?: string;
	date?: string;
	isCompleted?: boolean;
	hasAnswer?: boolean;
	important?: boolean;
	todo?: boolean;
	time?: boolean;
	question?: boolean;
}) => {
	const query: Array<Record<string | number, Record<string, any>>> = [
		{ $project: { _id: 0 } },
		{ $sort: { date: -1 } }
	];

	if (space) {
		query.push({ $match: { space } });
	}

	if (date) {
		const _date = new Date(date);
		query.push({
			$match: {
				$or: [
					{
						date: new Date(_date) // Format 1: Date object
					},
					{
						date: {
							$gte: new Date(_date.setHours(0, 0, 0, 0)),
							$lt: new Date(_date.setHours(23, 59, 59, 999))
						} // Format 2: ISODate format (Midnight to 23:59:59.999)
					},
					{
						date: {
							$gte: new Date(_date.setUTCHours(0, 0, 0, 0)),
							$lt: new Date(_date.setUTCHours(23, 59, 59, 999))
						} // Format 3: UTC Date (Midnight to 23:59:59.999)
					}
				]
			}
		});
	}

	if (search) {
		const options = ['title', 'reference', 'content', 'question', 'answer'];
		query.push({
			$match: {
				$or: options.map((option) => ({
					[option]: { $regex: search, $options: 'i' }
				}))
			}
		});
	}

	const logTypes = Object.entries({ todo, question, important, time })
		.map(([type, boolean]) => ({ type, boolean }))
		.filter(({ boolean }) => boolean);

	if (logTypes.length) {
		query.push({
			$match: {
				$or: logTypes.map(({ type }) => {
					return {
						type: {
							$eq: type
						}
					};
				})
			}
		});
	}

	if (isCompleted) {
		query.push({ $match: { isCompleted } });
	}

	if (hasAnswer) {
		query.push({
			$match: {
				$or: [
					{ answer: { $exists: hasAnswer } },
					{
						answer: { $eq: '' }
					}
				]
			}
		});
	}

	const result = await collection.aggregate(query).toArray();

	return result;
};

export const getSpaces = async () => {
	const spaces = await collection.distinct('space');

	return spaces;
};

export const updateLog = async (values: {
	id: string;
	date: Date;
	title?: string;
	content: string | string[];
	reference?: string;
	time?: number;
	importance?: number;
	priority?: number;
	type: LogType_enum;
	space: string;
	lastUpdated: Date;
	question?: string;
	answer?: string;
}) => {
	const { date, lastUpdated, ...rest } = values;
	await collection.updateOne(
		{ id: values.id },
		{
			$set: { date: new Date(date), lastUpdated: new Date(lastUpdated), ...rest }
		},
		{ upsert: true }
	);
};

export const deleteLog = async (id: string) => {
	await collection.deleteOne({ id });
};

export const getTitlesAndReferences = async (space: string) => {
	const result = await collection
		.aggregate([
			{ $match: { space } },
			{
				$project: {
					_id: 0,
					reference: 1,
					title: 1,
					date: 1
				}
			},
			{ $sort: { date: -1 } },
			{ $limit: 10 }
		])
		.toArray();

	return result;
};

export const getAllLogNotifications = async (spaces: string[]) => {
	const facet = spaces.reduce(
		(acc, space) => ({
			...acc,
			[`${space}/${LogType_enum.todo}`]: [
				{
					$match: {
						type: 'todo'
					}
				},
				{
					$match: {
						space
					}
				},
				{
					$match: {
						isCompleted: false
					}
				},
				{
					$count: 'count'
				}
			],
			[`${space}/${LogType_enum.question}`]: [
				{
					$match: {
						type: 'question'
					}
				},
				{
					$match: {
						space
					}
				},
				{
					$match: {
						$or: [
							{
								answer: {
									$not: {
										$exists: true
									}
								}
							},
							{
								answer: {
									$eq: ''
								}
							}
						]
					}
				},
				{
					$count: 'count'
				}
			]
		}),
		{}
	);

	const counts = await collection
		.aggregate([
			{
				$facet: facet
			}
		])
		.toArray();

	const mappedCounts = Object.entries(counts[0])
		.map(([key, countArray]) => {
			const count = countArray[0]?.count ?? 0;
			const [space, type] = key.split('/');
			return {
				space,
				type,
				count
			};
		})
		.reduce((result, { space, type, count }) => {
			const indexOfExistingSpace = result.findIndex((group) => group.space === space);
			result[indexOfExistingSpace] = { ...result[indexOfExistingSpace], [type]: count ?? 0 };

			return result;
		}, spaces.map((space) => ({ space })) as Array<{ space: string; type: string; count: number }>);

	return mappedCounts;
};
