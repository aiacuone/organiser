import { getSpaces, getTimes } from '$lib/server';
import { testSpaces } from '../testData';

export const load = async (req: Request, res: Response) => {
	// const spaces = getSpaces();
	const times = getTimes();

	return {
		spaces: testSpaces,
		times
	};
	// return {
	// 	spaces,
	// 	times
	// };
};
