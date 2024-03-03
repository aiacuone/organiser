import type { LocalStorage_enum } from '$lib/types';

export const getLocalStorage = (keyOrKeys: LocalStorage_enum | LocalStorage_enum[]) => {
	if (Array.isArray(keyOrKeys)) {
		return (keyOrKeys as LocalStorage_enum[]).map((key) => {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		});
	}

	const value = localStorage.getItem(keyOrKeys as LocalStorage_enum);
	return value ? JSON.parse(value) : null;
};

export const setLocalStorage = (
	KeyOrKeyValues: LocalStorage_enum | { key: LocalStorage_enum; value: any }[],
	value?: any
) => {
	const setItem = (key: LocalStorage_enum, _value: any) => {
		localStorage.setItem(key, JSON.stringify(_value));
	};

	if (Array.isArray(KeyOrKeyValues)) {
		KeyOrKeyValues.forEach(({ key, value: _value }) => {
			setItem(key, _value);
		});
	} else {
		setItem(KeyOrKeyValues, value);
	}
};
