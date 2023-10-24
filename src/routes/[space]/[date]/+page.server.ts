import { getReferences } from '$lib/api/logsLocalApi';

export const load = async (req: Request, res: Response) => {
	const dateFromUrl = req.url.pathname.split('/')[2];
	const space = req.url.pathname.split('/')[1];

	const references = await getReferences(space);

	return {
		date: dateFromUrl,
		references
	};
};
