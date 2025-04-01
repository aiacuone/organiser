import { getTitlesAndReferences } from '$lib/server/index.js'
import type { RequestEvent } from '@sveltejs/kit'

export const GET = async ({ params, locals }: RequestEvent) => {
	const { space } = params
	const { collection } = locals

	const titlesAndReferences = await getTitlesAndReferences(space as string, collection)

	return new Response(JSON.stringify(titlesAndReferences), { status: 200 })
}
