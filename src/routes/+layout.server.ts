// import { testData } from '../testData';
import { MongoClient } from 'mongodb';
import { MONGO_URL } from '$env/static/private';

export const load = async (req: Request, res: Response) => {
	const client = await MongoClient.connect(MONGO_URL);
	const db = client.db('time-logger');
	const collection = db.collection('aiacuone');

	const spacesDocument = await collection.findOne({ name: 'spaces' });
	const spaces = spacesDocument?.data;

	const timesDocument = await collection.findOne({ name: 'times' });
	const times = timesDocument?.data;

	// return {
	// 	...testData
	// };
	return {
		spaces,
		times
	};
};
