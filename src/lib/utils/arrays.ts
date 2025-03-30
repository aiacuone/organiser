export const arraysAreEqual = (arr1: Array<any>, arr2: Array<any>) => {
	if (arr1.length !== arr2.length) {
		return false // Different lengths, arrays are not equal
	}

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false // Elements at index i are not equal, arrays are not equal
		}
	}

	return true // All elements are equal, arrays are equal
}
