import { deleteLog, getLogs, updateLog } from '$lib/server'
import type { RequestEvent } from '@sveltejs/kit'

export const PATCH = async ({ request, locals }: RequestEvent) => {
	const data = await request.json()
	const { collection } = locals

	await updateLog(data, collection)

	return new Response(JSON.stringify(''), { status: 200 })
}

export const DELETE = async ({ request, locals }: RequestEvent) => {
	const { id } = await request.json()
	const { collection } = locals

	await deleteLog(id, collection)

	return new Response(JSON.stringify(''), { status: 200 })
}

export const GET = async ({ url: { searchParams }, locals }: RequestEvent) => {
	const objectSearchParams = Object.fromEntries(searchParams.entries())
	const json = objectSearchParams['json']
	const { collection } = locals

	let logs
	let total

	if (json) {
		const jsonArray = JSON.parse(objectSearchParams['json'])

		objectSearchParams['json'] = JSON.parse(objectSearchParams['json'])

		const reducedJsonParams = jsonArray.reduce(
			(object: Record<string, string[] | string>, [key, value]: string[]) => {
				const isMultiplesKey = ['type', 'searchType'].includes(key)

				if (isMultiplesKey) {
					if (object[key]) {
						object[key] = [...object[key], value]
					} else {
						object[key] = [value]
					}
				} else {
					object[key] = value
				}

				return object
			},
			{} as Record<string, string[] | string>
		)

		delete objectSearchParams['json']

		const params = { ...objectSearchParams, ...reducedJsonParams }

		;({ logs, total } = await getLogs(params, collection))
	} else {
		;({ logs, total } = await getLogs(objectSearchParams, collection))
	}

	return new Response(JSON.stringify({ logs, total }), { status: 200 })
}
