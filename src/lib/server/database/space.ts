import type { Collection } from 'mongodb'

export const getSpaces = async (collection: Collection) => {
	const spaces = await collection.distinct('space')

	return spaces
}

export const deleteSpace = async (space: string, collection: Collection) => {
	await collection.deleteMany({
		space
	})
}
