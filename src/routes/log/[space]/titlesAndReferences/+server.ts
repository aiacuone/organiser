import {
	checkAccessTokenMiddleware,
	getAndCheckCollectionFromToken,
	getTitlesAndReferences
} from '$lib/server/index.js'
import type { RequestEvent } from '@sveltejs/kit'

export const GET = async ({ request, params }: RequestEvent) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const { space } = params
			const titlesAndReferences = await getTitlesAndReferences(space as string, collection)

			return new Response(JSON.stringify(titlesAndReferences), { status: 200 })
		})
	)
