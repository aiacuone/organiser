import { getDate2DaysEarlier, getDayMonthYearFromDate, getYesterdaysDate } from '$lib';
import { testSpaces } from '../testData';

export const load = async (req: Request, res: Response) => {
	const todaysDate = new Date();
	const yesterdaysDate = getYesterdaysDate();
	const date2DaysEarlier = getDate2DaysEarlier();

	const getDateString = (date: Date) => {
		const { string } = getDayMonthYearFromDate(date);
		return string;
	};

	const times = [
		{ name: 'today', href: getDateString(todaysDate) },
		{ name: 'yesterday', href: getDateString(yesterdaysDate) },
		{ name: 'date', href: getDateString(date2DaysEarlier) }
	];

	return {
		spaces: testSpaces,
		times
	};
	// return {
	// 	spaces,
	// 	times
	// };
};
