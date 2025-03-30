export const getHyphenatedStringFromDate = (date: Date) => {
	const _date = new Date(date)
	return _date.toISOString().split('T')[0].replace(/-/g, '-').split('-').reverse().join('-')
}

//todo: replace these with stores. Have a store than uses the hyphenated value from the url, then returns both the hyphenated and the spaced version of the space.
export const replaceAllHyphensWithSpaces = (string: string) => string.replaceAll('-', ' ')

export const replaceAllSpacesWithHyphens = (string: string) => string.replaceAll(' ', '-')

export const getCapitalizedWords = (string: string) =>
	string.replace(/\b\w/g, (l) => l.toUpperCase())

export const capitalizeWords = (string: string) => {
	return string.replace(/\b\w/g, (match) => match.toUpperCase())
}

export const entriesArrayToSearchParamsString = (
	searchParamsArray: Array<[string, string]>
): string => {
	const filteredSearchParamsArray = searchParamsArray.filter(Boolean)
	const params = new URLSearchParams(filteredSearchParamsArray)
	return params.toString()
}

export const searchParamsStringToEntriesArray = (
	searchParams: URLSearchParams
): Array<[string, string]> => {
	const params = new URLSearchParams(searchParams)
	const queryParamsArray = Array.from(params.entries())
	return queryParamsArray
}

export const camelCaseToLower = (string: string) => {
	return string.replace(/([A-Z])/g, ' $1').toLowerCase()
}

export const camelCaseToCapitalized = (inputString: string): string => {
	const spacedString = inputString.replace(/([A-Z])/g, ' $1')
	return spacedString.charAt(0).toUpperCase() + spacedString.slice(1).trim()
}

export const capitalizeFirstLetter = (sentence: string) => {
	if (!sentence || sentence.length === 0) {
		return sentence
	}
	return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}
