import { getDayMonthYearFromDate, getLastFridayDate, getSpaces, getYesterdaysDate } from '$lib';

export const load = async (req: Request, res: Response) => {
	const todaysDate = new Date();
	const yesterdaysDate = getYesterdaysDate();
	const lastFriday = getLastFridayDate();

	const getDateString = (date: Date) => {
		const { string } = getDayMonthYearFromDate(date);
		return string;
	};

	const spaces = await getSpaces();
	const times = [
		{ name: 'today', href: getDateString(todaysDate) },
		{ name: 'yesterday', href: getDateString(yesterdaysDate) },
		{ name: 'friday', href: getDateString(lastFriday) }
	];

	const space = req.url.pathname.split('/')[1];

	return {
		spaces,
		times,
		space
	};
};
