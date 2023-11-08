export const getHyphenatedStringFromDate = (date: Date) => {
	const _date = new Date(date);
	return _date.toISOString().split('T')[0].replace(/-/g, '-').split('-').reverse().join('-');
};

export const replaceAllHyphensWithSpaces = (string: string) => string.replaceAll('-', ' ');

export const replaceAllSpacesWithHyphens = (string: string) => string.replaceAll(' ', '-');

export const getCapitalizedWords = (string: string) =>
	string.replace(/\b\w/g, (l) => l.toUpperCase());

export const objectToQueryString = (obj: Record<string, string>) => {
	return Object.entries(obj)
		.map(([key, value]) => {
			if (value) return encodeURIComponent(key) + '=' + encodeURIComponent(value);
		})
		.filter(Boolean)
		.join('&');
};

export const stringArrayToQueryString = (arr: string[]) => {
	return arr
		.map((query, index) => {
			return `query${index}=${query}`;
			// return 'query=' + index+query;
		})
		.filter(Boolean)
		.join('&');
};
