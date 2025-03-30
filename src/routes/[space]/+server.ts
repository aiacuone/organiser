import {
	checkAccessTokenMiddleware,
	deleteSpace,
	getAndCheckCollectionFromToken
} from '$lib/server/index.js'
import type { RequestEvent } from '@sveltejs/kit'

export const DELETE = async ({ request, params }: RequestEvent) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const { space } = params

			await deleteSpace(space as string, collection)

			return new Response(JSON.stringify({ message: 'Space deleted' }), { status: 200 })
		})
	)
