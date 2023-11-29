import { collection } from './common';

export const getSpaces = async () => {
	const spaces = await collection.distinct('space');

	return spaces;
};

export const deleteSpace = async (space: string) => {
	await collection.deleteMany({
		space
	});
};
