export const getHyphenatedStringFromDate = (date: Date) =>
	date.toISOString().split('T')[0].replace(/-/g, '-').split('-').reverse().join('-');

export const replaceAllHyphensWithSpaces = (string: string) => string.replaceAll('-', ' ');

export const replaceAllSpacesWithHyphens = (string: string) => string.replaceAll(' ', '-');
