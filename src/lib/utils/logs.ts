interface values_int {
	title?: string;
	reference?: string;
	bullets?: string[];
	time?: number;
	content?: string;
	priority?: number;
	importance?: number;
	isCompleted?: boolean;
	question?: string;
	answer?: string;
}

export const getHaveValuesChanged = ({
	values,
	initialValues
}: {
	values: values_int;
	initialValues: values_int;
}) => {
	return (
		values.title !== initialValues.title ||
		values.reference !== initialValues.reference ||
		(values.bullets &&
			initialValues.bullets &&
			!arraysHaveSameValues(values.bullets, initialValues.bullets)) ||
		values.time !== initialValues.time ||
		values.content !== initialValues.content ||
		values.priority !== initialValues.priority ||
		values.importance !== initialValues.importance ||
		values.isCompleted !== initialValues.isCompleted ||
		values.question !== initialValues.question ||
		values.answer !== initialValues.answer
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
