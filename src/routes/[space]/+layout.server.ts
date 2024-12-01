import { replaceAllHyphensWithSpaces } from '$lib/utils/strings';

export const load = async (req: Request) => {
	return {
		space: replaceAllHyphensWithSpaces(req.url.pathname.split('/')[1])
	};
};
