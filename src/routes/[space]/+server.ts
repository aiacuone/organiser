import { deleteSpace } from '$lib/server/index.js'
import type { RequestEvent } from '@sveltejs/kit'
import type { Collection } from 'mongodb'

export const DELETE = async ({ params, locals }: RequestEvent) => {
	const { space } = params
	const { collection } = locals

	await deleteSpace(space as string, collection as Collection)

	return new Response(JSON.stringify({ message: 'Space deleted' }), { status: 200 })
}
