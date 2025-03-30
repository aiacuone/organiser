import { MONGO_URL } from '$env/static/private'
import { Collection, MongoClient } from 'mongodb'

export const getDatabase = async () => {
	const client = await MongoClient.connect(MONGO_URL)
	const database = client.db('organiser')
	return database
}

export const dbCollections: Record<string, Collection> = {}

export const setCollection = async (collectionName: string) => {
	const db = await getDatabase()
	const collection = db.collection(collectionName)
	dbCollections[collectionName] = collection
}
