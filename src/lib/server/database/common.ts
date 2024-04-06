import { MONGO_URL } from '$env/static/private';
import { Collection, MongoClient } from 'mongodb';

export const getDatabase = async () => {
	const client = await MongoClient.connect(MONGO_URL);
	const database = client.db('organiser');
	return database;
};

export let currentUserSocialId: string | null;

export const setCurrentUserSocialId = (socialId: string | null) => {
	currentUserSocialId = socialId;
};

export let dbCollection: Collection | null;

export const setCollection = async (_collectionName: string | null) => {
	if (!_collectionName) return (dbCollection = null);

	const db = await getDatabase();
	const _dbCollection = db.collection(_collectionName);
	dbCollection = _dbCollection;
};
