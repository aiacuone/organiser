import {
	checkAccessTokenMiddleware,
	deleteLog,
	getAndCheckCollectionFromToken,
	getLogs,
	updateLog
} from '$lib/server'
import type { RequestEvent } from '@sveltejs/kit'

export const PATCH = async ({ request }: RequestEvent) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const data = await request.json()
			await updateLog(data, collection)

			return new Response(JSON.stringify(''), { status: 200 })
		})
	)

export const DELETE = async ({ request }: RequestEvent) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const { id } = await request.json()

			await deleteLog(id, collection)

			return new Response(JSON.stringify(''), { status: 200 })
		})
	)

export const GET = async ({ request, url: { searchParams } }: RequestEvent) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const objectSearchParams = Object.fromEntries(searchParams.entries())
			const json = objectSearchParams['json']

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
		})
	)
