import { getSpaces, getTimes } from '$lib/server';
// import { testData } from '../testData';

export const load = async (req: Request, res: Response) => {
	const spaces = getSpaces();
	const times = getTimes();

	// return {
	// 	...testData
	// };
	return {
		spaces,
		times
	};
};
