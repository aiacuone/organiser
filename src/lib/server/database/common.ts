import { MONGO_URL } from '$env/static/private';
import { Collection, MongoClient } from 'mongodb';

export const getDatabase = async () => {
	const client = await MongoClient.connect(MONGO_URL);
	const database = client.db('organiser');
	return database;
};

export let dbCollection: Collection;

export const setCollection = async (_collectionName: string) => {
	const db = await getDatabase();
	const _dbCollection = db.collection(_collectionName);
	dbCollection = _dbCollection;
};
