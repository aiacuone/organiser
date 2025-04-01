import { getAllLogNotifications } from '$lib/server/index.js'
import type { RequestEvent } from '@sveltejs/kit'

export const GET = async ({ url: { searchParams }, locals }: RequestEvent) => {
	const result = new URLSearchParams(searchParams).entries()
	const { collection } = locals

	const spaces = Array.from(result, (x) => x[1])

	const allLogNotifications = await getAllLogNotifications(spaces, collection)

	return new Response(JSON.stringify(allLogNotifications), { status: 200 })
}
