export const getHyphenatedStringFromDate = (date: Date) => {
	const _date = new Date(date);
	return _date.toISOString().split('T')[0].replace(/-/g, '-').split('-').reverse().join('-');
};

//todo: replace these with stores. Have a store than uses the hyphenated value from the url, then returns both the hyphenated and the spaced version of the space.
export const replaceAllHyphensWithSpaces = (string: string) => string.replaceAll('-', ' ');

export const replaceAllSpacesWithHyphens = (string: string) => string.replaceAll(' ', '-');

export const getCapitalizedWords = (string: string) =>
	string.replace(/\b\w/g, (l) => l.toUpperCase());

export const objectToQueryString = (obj: Record<string, string | number | boolean>) => {
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
		})
		.filter(Boolean)
		.join('&');
};

export const capitalizeWords = (string: string) => {
	return string.replace(/\b\w/g, (match) => match.toUpperCase());
};

export const searchParamsStringToArray = (searchParams: URLSearchParams) => {
	const params = new URLSearchParams(searchParams);
	const queryParamsArray = Array.from(params.entries());
	return queryParamsArray;
};

export function arrayToSearchParamsString(searchParamsArray: Array<string[]>) {
	const filteredSearchParamsArray = searchParamsArray.filter(Boolean);
	const params = new URLSearchParams(filteredSearchParamsArray);
	return params.toString();
}

export const camelCaseToLower = (string: string) => {
	return string.replace(/([A-Z])/g, ' $1').toLowerCase();
};
