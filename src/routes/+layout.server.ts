import { getCollection } from '$lib/server';
// import { testData } from '../testData';

export const load = async (req: Request, res: Response) => {
	const collection = await getCollection('aiacuone');

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
