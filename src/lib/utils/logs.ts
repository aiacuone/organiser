interface values_int {
	title?: string;
	reference?: string;
	bullets?: string[];
	time?: number;
	content?: string;
	priority?: number;
	importance?: number;
	isCompleted?: boolean;
}

export const getHaveValuesChanged = ({
	values,
	originalValues
}: {
	values: values_int;
	originalValues: values_int;
}) => {
	return (
		values.title !== originalValues.title ||
		values.reference !== originalValues.reference ||
		(values.bullets &&
			originalValues.bullets &&
			!arraysHaveSameValues(values.bullets, originalValues.bullets)) ||
		values.time !== originalValues.time ||
		values.content !== originalValues.content ||
		values.priority !== originalValues.priority ||
		values.importance !== originalValues.importance ||
		values.isCompleted !== originalValues.isCompleted
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
