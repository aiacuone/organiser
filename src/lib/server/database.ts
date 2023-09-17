import { MONGO_URL } from '$env/static/private';
import type { Space_int } from '$lib/types';
import { MongoClient } from 'mongodb';

export const getDatabase = async () => {
	const client = await MongoClient.connect(MONGO_URL);
	const database = client.db('time-logger');
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

export const getSpaces = async () => {
	const spacesDocument = await collection.findOne({ name: 'spaces' });
	const spaces = spacesDocument?.data;

	return spaces;
};

export const getTimes = async () => {
	const timesDocument = await collection.findOne({ name: 'times' });
	const times = timesDocument?.data;

	return times;
};
