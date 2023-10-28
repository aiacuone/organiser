import { getSpaces } from '$lib';

export const load = async (req: Request, res: Response) => {
	const spaces = await getSpaces();

	const space = req.url.pathname.split('/')[1];

	return {
		spaces,
		// times,
		space
	};
};
