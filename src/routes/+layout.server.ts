import { testData } from '../testData';

export const load = async (req: Request, res: Response) => {
	return {
		...testData
	};
};
