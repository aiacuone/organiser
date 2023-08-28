export const getDayFromNumber = (day: number) => {
	switch (day) {
		case 0:
			return 'Sunday';
		case 1:
			return 'Monday';
		case 2:
			return 'Tuesday';
		case 3:
			return 'Wednesday';
		case 4:
			return 'Thursday';
		case 5:
			return 'Friday';
		case 6:
			return 'Saturday';
	}
};

export const getDayMonthYearFromDate = (date: Date) => {
	const _date = new Date(date);
	const day = _date.getDate();
	const month = _date.getMonth() + 1;
	const year = _date.getFullYear();
	const hour = _date.getHours();
	const minutes = _date.getMinutes();

	return {
		day,
		month,
		year,
		string: `${day}-${month}-${year}`,
		dayString: getDayFromNumber(_date.getDay()),
		hour,
		minutes
	};
};

export const getTodaysDayMonthYear = () => {
	const date = new Date();
	return getDayMonthYearFromDate(new Date(date));
};

export const getYesterdaysDayMonthYear = () => {
	const date = getYesterdaysDate();
	return getDayMonthYearFromDate(new Date(date));
};

export const getYesterdaysDate = () => {
	const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
	return new Date(date);
};

export const getDate2DaysEarlier = () => {
	const date = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
	return new Date(date);
};

export const getDateFromHyphenatedString = (dateString: string) => {
	function isValidDateFormat(dateString: string) {
		const regex = /^\d{4}-\d{1,2}-\d{1,2}$/;
		return regex.test(dateString);
	}
	if (!isValidDateFormat(dateString)) throw new Error('Invalid date format');

	const dateParts = dateString.split('-');
	const mappedDateParts = dateParts.map((part) => parseInt(part));

	const date = new Date(mappedDateParts[0], mappedDateParts[1] - 1, mappedDateParts[2]);
	return date;
};
