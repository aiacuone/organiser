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
	type,
	isCompleted,
	hasAnswer
}: Record<'space' | 'search' | 'date' | 'type' | 'isCompleted' | 'hasAnswer', string>) => {
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

	if (type) {
		query.push({ $match: { type } });
	}

	if (isCompleted) {
		const _isCompleted = JSON.parse(isCompleted);
		query.push({ $match: { isCompleted: _isCompleted } });
	}

	if (hasAnswer) {
		const _hasAnswer = JSON.parse(hasAnswer);
		if (!_hasAnswer) {
			query.push({
				$match: {
					$or: [
						{ answer: { $exists: _hasAnswer } },
						{
							answer: { $eq: '' }
						}
					]
				}
			});
		}
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

export const getLogNotifications = async (space: string, types: Array<LogType_enum>) => {
	const facet: any = {};

	if (types.includes(LogType_enum.todo)) {
		facet[LogType_enum.todo] = [
			{
				$match: {
					type: 'todo'
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
		];
	}

	if (types.includes(LogType_enum.question)) {
		facet[LogType_enum.question] = [
			{
				$match: {
					type: 'question'
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
		];
	}

	const counts = await collection
		.aggregate([
			{
				$match: {
					space
				}
			},
			{
				$facet: facet
			}
		])
		.toArray();

	const mappedCounts = Object.entries(counts[0]).map(([key, countArray]) => {
		const count = countArray[0]?.count ?? 0;
		return {
			type: key,
			count
		};
	});

	return mappedCounts;
};
