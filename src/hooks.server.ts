import type { Handle } from '@sveltejs/kit'
import { dbCollections, setCollection } from '$lib/server'

export const handle: Handle = async ({ resolve, event }) => {
	// const { request } = event
	// const token = event.request.headers.get('Authorization')?.substring(7) ?? null
	// const decodedToken = token && jwt.decode(token)

	//todo: change this back when complete
	// const userSocialId = decodedToken?.sub as string
	const userSocialId = 'google-oauth2|115454758242624071339' as string

	// const requestWithNoBody = new Request(request.url, {
	// 	...request,
	// 	body: null
	// })

	// if (!token) {
	// 	event.request = requestWithNoBody
	// 	return resolve(event)
	// }
	const collection = dbCollections[userSocialId]
	const doesCollectionExist = !!collection

	if (!event.locals.collection) event.locals.collection = collection
	if (!event.locals.userSocialId) event.locals.userSocialId = userSocialId

	if (!doesCollectionExist) {
		console.log('New collection created for user')
		await setCollection(userSocialId)
		return resolve(event)
	}

	// Apply CORS header for API routes
	if (event.url.pathname.startsWith('/api')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*'
				}
			})
		}
	}

	const response = await resolve(event)
	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', `*`)
	}
	return response
}
