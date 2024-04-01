import { LogType_enum, Log_enum } from '$lib/types';
import type { Collection } from 'mongodb';
import { collection } from './common';

export const getLogs = async (
	{
		space,
		date,
		isChecked,
		isAnswered,
		limit = '10',
		skip,
		type,
		search,
		searchType
	}: {
		space?: string;
		date?: string | Date;
		isChecked?: 'true' | 'false';
		isAnswered?: 'true' | 'false';
		limit?: string;
		skip?: string;
		search?: string;
		searchType?: string[];
		type?: string[];
	},
	collection: Collection
) => {
	const baseQuery: Array<any> = [{ $project: { _id: 0 } }, { $sort: { date: -1 } }];

	if (space) {
		baseQuery.push({ $match: { space } });
	}

	if (date) {
		const _date = new Date(date);
		baseQuery.push({
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
		const searchTypeArrays = {
			[Log_enum.questions]: [
				{ questions: { $elemMatch: { question: { $regex: search, $options: 'i' } } } },
				{ questions: { $elemMatch: { answer: { $regex: search, $options: 'i' } } } }
			],
			[Log_enum.listItems]: [{ listItems: { $elemMatch: { $regex: search, $options: 'i' } } }],
			[Log_enum.checkboxItems]: [
				{ checkboxItems: { $elemMatch: { text: { $regex: search, $options: 'i' } } } }
			],
			[Log_enum.title]: [{ title: { $regex: search, $options: 'i' } }],
			[Log_enum.reference]: [{ reference: { $regex: search, $options: 'i' } }]
		};

		if (search && searchType && searchType.length) {
			const orArray = [];
			if (searchType.includes(Log_enum.questions)) {
				orArray.push(...searchTypeArrays[Log_enum.questions]);
			}
			if (searchType.includes(Log_enum.listItems)) {
				orArray.push(...searchTypeArrays[Log_enum.listItems]);
			}
			if (searchType.includes(Log_enum.checkboxItems)) {
				orArray.push(...searchTypeArrays[Log_enum.checkboxItems]);
			}
			if (searchType.includes(Log_enum.title)) {
				orArray.push(...searchTypeArrays[Log_enum.title]);
			}
			if (searchType.includes(Log_enum.reference)) {
				orArray.push(...searchTypeArrays[Log_enum.reference]);
			}
			baseQuery.push({
				$match: {
					$or: orArray
				}
			});
		} else {
			baseQuery.push({
				$match: {
					$or: Object.values(searchTypeArrays).flat()
				}
			});
		}
	}

	if (type && type.length) {
		baseQuery.push({
			$match: {
				$or: type.map((t) => {
					return {
						type: {
							$eq: t
						}
					};
				})
			}
		});
	}

	if (isChecked) {
		const parsedBoolean = JSON.parse(isChecked);
		baseQuery.push({
			$match: {
				'checkboxItems.isChecked': { $eq: parsedBoolean }
			}
		});
	}

	if (isAnswered) {
		const parsedBoolean = JSON.parse(isAnswered);
		baseQuery.push({
			$match: {
				$or: [
					{
						questions: {
							$elemMatch: {
								answer: { $exists: parsedBoolean }
							}
						}
					},
					{
						questions: {
							$elemMatch: {
								answer: { $eq: '' }
							}
						}
					}
				]
			}
		});
	}

	const logQuery = [...baseQuery];

	if (skip) {
		logQuery.push({ $skip: parseInt(skip) });
	}

	if (limit) {
		logQuery.push({ $limit: parseInt(limit) });
	}

	const countQuery = [
		...baseQuery,
		{
			$count: 'total'
		}
	];

	const queryWithTotal: Array<any> = [
		{
			$facet: {
				logs: logQuery,
				total: countQuery
			}
		}
	];

	const result = await collection.aggregate(queryWithTotal).toArray();
	const logs = result[0].logs;
	const total = result[0].total[0]?.total ?? 0;

	return { logs, total };
};

export const updateLog = async (
	values: {
		id: string;
		date: Date;
		title?: string;
		reference?: string;
		time?: number;
		importance?: number;
		priority?: number;
		type: LogType_enum;
		space: string;
		lastUpdated: Date;
		question?: string;
		answer?: string;
	},
	collection: Collection
) => {
	const { date, lastUpdated, ...rest } = values;
	await collection.updateOne(
		{ id: values.id },
		{
			$set: { date: new Date(date), lastUpdated: new Date(lastUpdated), ...rest }
		},
		{ upsert: true }
	);
};

export const deleteLog = async (id: string, collection: Collection) => {
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
			{
				$group: {
					_id: '$title',
					title: { $first: '$title' },
					reference: { $first: '$reference' }
				}
			}
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
						'checkboxItems.isChecked': { $eq: false }
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
								questions: {
									$elemMatch: {
										answer: { $exists: false }
									}
								}
							},
							{
								questions: {
									$elemMatch: {
										answer: { $eq: '' }
									}
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
