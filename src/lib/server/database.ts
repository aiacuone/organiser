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
	console.log('createNote', { id, title, content, space });
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
};

export const deleteNote = async (id: string) => {
	console.log('deleteNote', id);
};
