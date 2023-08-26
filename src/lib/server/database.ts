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
	content
}: {
	id: string;
	title: string;
	content: string;
}) => {
	console.log('createNote', { id, title, content });
};

export const updateNote = async ({
	id,
	title,
	content
}: {
	id: string;
	title: string;
	content: string;
}) => {
	console.log('updateNote', { id, title, content });
};

export const deleteNote = async (id: string) => {
	console.log('deleteNote', id);
};
