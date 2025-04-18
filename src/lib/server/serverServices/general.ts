import jwt from 'jsonwebtoken'
import { getSubstringToken } from './auth'
import type { Collection, Document } from 'mongodb'
import { dbCollections } from '../database'

export const getAndCheckCollectionFromToken = async (
	request: Request,
	callback: (collection: Collection<Document>) => Promise<Response>
): Promise<Response> => {
	const token = request.headers.get('authorization')
	const substringToken = getSubstringToken(token as string)
	const decodedToken = jwt.decode(substringToken)
	const userSocialId = decodedToken?.sub as string

	if (!userSocialId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

	const collection = dbCollections[userSocialId]
	return await callback(collection)
}
