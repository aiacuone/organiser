import { MONGO_URL } from '$env/static/private'
import { MongoClient } from 'mongodb'

export const getDatabase = async () => {
	try {
		const client = await MongoClient.connect(MONGO_URL)
		const database = client.db('organiser')
		return { database, client } // Return both database and client
	} catch (error) {
		console.error('Error connecting to database:', error)
		throw error // Rethrow the error for handling elsewhere
	}
}

export const getCollection = async (collectionName) => {
	try {
		const { database, client } = await getDatabase()

		if (!database) return null

		// Check if the collection exists
		const collections = await database.listCollections({ name: collectionName }).toArray()

		if (collections.length > 0) {
			const collection = database.collection(collectionName)
			await client.close()
			return collection
		} else {
			await client.close()
			return null // Collection does not exist
		}
	} catch (error) {
		console.error(`Error retrieving collection ${collectionName}:`, error)
		return null
	}
}

export const setCollection = async (collectionName) => {
	try {
		const { database, client } = await getDatabase()
		if (!database) return false

		await database.createCollection(collectionName)

		await client.close()
		return true
	} catch (error) {
		console.error(`Error creating collection ${collectionName}:`, error)
		return false
	}
}
