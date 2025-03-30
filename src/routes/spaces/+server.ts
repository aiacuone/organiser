import {
	checkAccessTokenMiddleware,
	getAndCheckCollectionFromToken,
	getSpaces
} from '$lib/server/index.js'
import type { RequestEvent } from '@sveltejs/kit'

export const GET = async ({ request }: RequestEvent) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const spaces = await getSpaces(collection)

			return new Response(JSON.stringify(spaces), { status: 200 })
		})
	)
