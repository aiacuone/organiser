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

// export const getTodaysDayMonthYear = () => {
// 	const date = new Date();
// 	return getDayMonthYearFromDate(new Date(date));
// };

// export const getYesterdaysDayMonthYear = () => {
// 	const date = getYesterdaysDate();
// 	return getDayMonthYearFromDate(new Date(date));
// };

// export const getYesterdaysDate = () => {
// 	const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
// 	return new Date(date);
// };

export const getDate2DaysEarlier = () => {
	const date = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
	return new Date(date);
};

export const getDateFromHyphenatedString = (dateString: string) => {
	const [day, month, year] = dateString.split('-').map(Number);
	// console.log({ day, month, year });
	// if (isNaN(day) || isNaN(month) || isNaN(year)) {
	// 	throw new Error('Invalid date format');
	// }

	return new Date(Date.UTC(year, month - 1, day));
};

// export const getLastFridayDate = () => {
// 	const today = new Date();
// 	const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
// 	const daysUntilFriday = (dayOfWeek + 7 - 5) % 7; // Calculate how many days to subtract to get to the last Friday

// 	const lastFriday = new Date(today);
// 	lastFriday.setDate(today.getDate() - daysUntilFriday);

// 	return lastFriday;
// };

export const getDayFromHyphenatedString = (dateString: string) => {
	const date = getDateFromHyphenatedString(dateString);
	const day = getDayFromNumber(date.getDay());
	return day;
};
