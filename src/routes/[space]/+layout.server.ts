import { replaceAllHyphensWithSpaces } from '$lib/utils/strings';

export const load = async (req: Request, res: Response) => {
	return {
		space: replaceAllHyphensWithSpaces(req.url.pathname.split('/')[1])
	};
};
