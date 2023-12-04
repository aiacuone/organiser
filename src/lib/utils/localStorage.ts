import type { LocalStorage_enum } from '$lib/types';

export const getLocalStorage = (key: LocalStorage_enum) => {
	const value = localStorage.getItem(key);
	if (value) {
		return JSON.parse(value);
	}
	return null;
};

export const setLocalStorage = (key: LocalStorage_enum, value: any) => {
	localStorage.setItem(key, JSON.stringify(value));
};
