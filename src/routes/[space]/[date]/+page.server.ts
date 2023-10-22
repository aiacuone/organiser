import { getDateFromHyphenatedString, getDateLogs } from '$lib';

export const load = async (req: Request, res: Response) => {
	const date = new Date();

	const spaceFromUrl = req.url.pathname.split('/')[1];
	const dateFromUrl = req.url.pathname.split('/')[2];

	const logs = await getDateLogs({
		space: spaceFromUrl,
		date: getDateFromHyphenatedString(dateFromUrl) ?? date
	});

	return {
		date: dateFromUrl,
		logs
	};
};
