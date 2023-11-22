import { getDateFromHyphenatedString, getLogs } from '$lib';

export const load = async (req: Request, res: Response) => {
	const dateFromUrl = req.url.pathname.split('/')[2];

	const { space, date } = req.params;

	const initialLogs = await getLogs({
		space,
		date: getDateFromHyphenatedString(date)
	})
		.then((res) => res)
		.catch((err) => console.log(err));

	return {
		date: dateFromUrl,
		initialLogs
	};
};
