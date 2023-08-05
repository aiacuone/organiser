export const getDayMonthYearFromDate = (date: Date) => {
	const _date = new Date(date);
	const day = _date.getDate();
	const month = _date.getMonth() + 1;
	const year = _date.getFullYear();

	return {
		day,
		month,
		year,
		string: `${day}-${month}-${year}`
	};
};

export const getTodaysDayMonthYear = () => {
	const date = new Date();
	return getDayMonthYearFromDate(new Date(date));
};

export const getYesterdaysDayMonthYear = () => {
	const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
	return getDayMonthYearFromDate(new Date(date));
};
