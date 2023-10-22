export const getHyphenatedStringFromDate = (date: Date) =>
	date.toISOString().split('T')[0].replace(/-/g, '-').split('-').reverse().join('-');
