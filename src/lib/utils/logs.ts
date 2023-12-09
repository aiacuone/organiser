import type { Log_enum, Log_int } from '$lib/types';

interface OptionalLogInt extends Partial<Log_int> {}

export const getHaveValuesChanged = ({
	values,
	originalValues
}: {
	values: OptionalLogInt;
	originalValues: OptionalLogInt;
}) => {
	return Object.keys(values).some(
		(key) => values[key as Log_enum] !== originalValues[key as Log_enum]
	);
};

export const arraysHaveSameValues = (arr1: string[], arr2: string[]): boolean => {
	if (arr1.length !== arr2.length) {
		return false;
	}

	const sortedArr1 = arr1.slice().sort();
	const sortedArr2 = arr2.slice().sort();

	for (let i = 0; i < sortedArr1.length; i++) {
		if (sortedArr1[i] !== sortedArr2[i]) {
			return false;
		}
	}

	return true;
};
