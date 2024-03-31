import jwt from 'jsonwebtoken';
import { getSubstringToken } from './auth';
import { getCollection, getDatabase } from '../database';
import type { Collection, Document } from 'mongodb';

export const getAndCheckCollectionFromToken = async (
	request: Request
): Promise<Collection<Document>> => {
	const token = request.headers.get('authorization');
	const substringToken = getSubstringToken(token as string);
	const decodedToken = jwt.decode(substringToken);
	const userSocialId = decodedToken?.sub as string;
	const collection = await getCollection(userSocialId);
	console.log({ userSocialId, collection });

	const db = await getDatabase();
	const collections = await db.listCollections().toArray();
	const doesCollectionExist = collections.some((collection) => collection.name === userSocialId);

	if (!doesCollectionExist) {
		db.createCollection(userSocialId);
	}

	return collection;
};
