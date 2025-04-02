import type { Handle } from '@sveltejs/kit'
import { setCollection } from '$lib/server'
import { handle as authHandle } from './auth'
import { sequence } from '@sveltejs/kit/hooks'
import { getCollection } from './lib/server/database/common'

const customHandle: Handle = async ({ resolve, event }) => {
	const session = await event.locals.getSession()

	if (!session) {
		event.request = requestWithNoBody
		return resolve(event)
	}

	const userSub = session?.user?.sub as string

	const collection = await getCollection(userSub)

	if (!event.locals.collection) event.locals.collection = collection
	if (!event.locals.userSub) event.locals.userSub = userSub

	if (!collection) {
		await setCollection(userSub)

		console.log('Collection created for user social ID:', userSub)

		return resolve(event)
	}

	if (!userSub) {
		console.error('Error: No user social ID found')

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

export const handle = sequence(authHandle, customHandle)
