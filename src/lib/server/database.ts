import { MONGO_URL } from '$env/static/private';
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
	space
}: {
	id: string;
	title: string;
	content: string;
	space: string;
}) => {
	collection.updateOne(
		{ name: 'spaces', 'data.name': space },
		{ $push: { 'data.$.notes': { id, title, content, date: new Date() } } }
	);
};

export const updateNote = async ({
	id,
	title,
	content,
	space
}: {
	id: string;
	title: string;
	content: string;
	space: string;
}) => {
	console.log('updateNote', { id, title, content, space });
	// collection.updateOne(
	// 	{ name: 'spaces', 'data.name': space },
	// 	{ $set: { 'data.$.notes': { id, title, content } } }
	// );
};

export const deleteNote = async ({ id, space }: { id: string; space: string }) => {
	collection.updateOne(
		{ name: 'spaces', 'data.name': space },
		{ $pull: { 'data.$.notes': { id } } }
	);
};
