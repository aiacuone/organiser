import {
	checkAccessTokenMiddleware,
	getAllLogNotifications,
	getAndCheckCollectionFromToken
} from '$lib/server/index.js'
import type { RequestEvent } from '@sveltejs/kit'

export const GET = async ({ request, url: { searchParams } }: RequestEvent) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const result = new URLSearchParams(searchParams).entries()

			const spaces = Array.from(result, (x) => x[1])

			const allLogNotifications = await getAllLogNotifications(spaces, collection)

			return new Response(JSON.stringify(allLogNotifications), { status: 200 })
		})
	)
