import type { RequestEvent } from '@sveltejs/kit'

export const load = async (req: RequestEvent) => {
	const dateFromUrl = req.url.pathname.split('/')[2]

	return {
		date: dateFromUrl
	}
}
