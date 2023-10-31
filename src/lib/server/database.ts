import { MONGO_URL } from '$env/static/private';
import type { LogType_enum } from '$lib/types';
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

export const getDateLogs = async ({ space, date }: { space: string; date: Date }) => {
	const result = await collection
		.aggregate([
			{ $match: { space } },
			{
				$match: {
					$or: [
						{
							date: new Date(date) // Format 1: Date object
						},
						{
							date: {
								$gte: new Date(date.setHours(0, 0, 0, 0)),
								$lt: new Date(date.setHours(23, 59, 59, 999))
							} // Format 2: ISODate format (Midnight to 23:59:59.999)
						},
						{
							date: {
								$gte: new Date(date.setUTCHours(0, 0, 0, 0)),
								$lt: new Date(date.setUTCHours(23, 59, 59, 999))
							} // Format 3: UTC Date (Midnight to 23:59:59.999)
						}
					]
				}
			},
			{ $project: { _id: 0 } },
			{ $sort: { date: -1 } }
		])
		.toArray();

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

// export const getReferences = async (space: string) => {
// 	const spaces = await collection.distinct('reference', { space });

// 	return spaces;
// };

// export const getTitles = async (space: string) => {
// 	const spaces = await collection.distinct('title', { space });
// 	return spaces;
// };

export const getFilteredLogs = async ({ space, value }: { space: string; value: string }) => {
	const result = await collection
		.aggregate([
			{ $match: { space } },
			{
				$match: {
					$or: [
						{ title: { $regex: value, $options: 'i' } },
						{ reference: { $regex: value, $options: 'i' } },
						{ content: { $regex: value, $options: 'i' } }
					]
				}
			},
			{ $project: { _id: 0 } },
			{ $sort: { date: -1 } }
		])
		.toArray();

	return result;
};
