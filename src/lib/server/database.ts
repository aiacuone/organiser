import { MONGO_URL } from '$env/static/private';
import type { LogType_enum, Space_int } from '$lib/types';
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

export const createNote = async ({
	id,
	title,
	content,
	space,
	date,
	time,
	reference
}: {
	id: string;
	title: string;
	content: string;
	space: string;
	date: Date;
	time: number;
	reference: string;
}): Promise<{ spaces: Space_int[] }> => {
	await collection.updateOne(
		{ name: 'spaces', 'data.name': space },
		{ $push: { 'data.$.notes': { id, title, content, date, time, reference } } }
	);
	const spaces = await getSpaces();
	return { spaces };
};

export const updateNote = async ({
	id,
	title,
	content,
	space,
	time,
	date,
	reference
}: {
	id: string;
	title: string;
	content: string;
	space: string;
	time: number;
	date: Date;
	reference: string;
}): Promise<{ spaces: Space_int[] }> => {
	const updatedNote = {
		id,
		title,
		content,
		date,
		time,
		reference
	};

	await collection.updateOne(
		{ name: 'spaces', 'data.name': space },
		{
			$set: {
				'data.$.notes.$[note]': updatedNote
			}
		},
		{
			arrayFilters: [{ 'note.id': id }]
		}
	);

	const spaces = await getSpaces();
	return { spaces };
};

export const deleteNote = async ({
	id,
	space
}: {
	id: string;
	space: string;
}): Promise<{ spaces: Space_int[] }> => {
	await collection.updateOne(
		{ name: 'spaces', 'data.name': space },
		{ $pull: { 'data.$.notes': { id } } }
	);
	const spaces = await getSpaces();
	return { spaces };
};

export const getTimes = async () => {
	const timesDocument = await collection.findOne({ name: 'times' });
	const times = timesDocument?.data;

	return times;
};

export const getDateLogs = async ({ space, date }: { space: string; date: Date }) => {
	return await collection
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
			{ $project: { _id: 0 } }
		])
		.toArray();
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
}) => {
	const { date, ...rest } = values;
	await collection.updateOne(
		{ id: values.id },
		{
			$set: { date: new Date(date), ...rest }
		},
		{ upsert: true }
	);
};

export const deleteLog = async (id: string) => {
	await collection.deleteOne({ id });
};
