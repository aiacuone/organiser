import { getDate2DaysEarlier, getDayMonthYearFromDate, getSpaces, getYesterdaysDate } from '$lib';

export const load = async (req: Request, res: Response) => {
	const todaysDate = new Date();
	const yesterdaysDate = getYesterdaysDate();
	const date2DaysEarlier = getDate2DaysEarlier();

	const getDateString = (date: Date) => {
		const { string } = getDayMonthYearFromDate(date);
		return string;
	};

	const spaces = await getSpaces();
	const times = [
		{ name: 'today', href: getDateString(todaysDate) },
		{ name: 'yesterday', href: getDateString(yesterdaysDate) },
		{ name: 'date', href: getDateString(date2DaysEarlier) }
	];

	const space = req.url.pathname.split('/')[1];

	return {
		spaces,
		times,
		space
	};
};
