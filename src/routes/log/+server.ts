import {
	checkAccessTokenMiddleware,
	deleteLog,
	getAndCheckCollectionFromToken,
	getLogs,
	updateLog
} from '$lib/server';

export const PATCH = async ({ request }) =>
	checkAccessTokenMiddleware(request, async () => {
		const collection = await getAndCheckCollectionFromToken(request);
		const data = await request.json();
		await updateLog(data, collection);

		return new Response(JSON.stringify(''), { status: 200 });
	});

export const DELETE = async ({ request }) =>
	checkAccessTokenMiddleware(request, async () => {
		const collection = await getAndCheckCollectionFromToken(request);
		const { id } = await request.json();

		await deleteLog(id, collection);

		return new Response(JSON.stringify(''), { status: 200 });
	});

export const GET = async ({ request, url: { searchParams } }) =>
	checkAccessTokenMiddleware(request, async () => {
		const collection = await getAndCheckCollectionFromToken(request);
		const objectSearchParams = Object.fromEntries(searchParams.entries());
		const json = objectSearchParams['json'];

		let logs;
		let total;

		if (json) {
			const jsonArray = JSON.parse(objectSearchParams['json']);

			objectSearchParams['json'] = JSON.parse(objectSearchParams['json']);

			const reducedJsonParams = jsonArray.reduce((object, [key, value]) => {
				const isMultiplesKey = ['type', 'searchType'].includes(key);

				if (isMultiplesKey) {
					if (object[key]) {
						object[key] = [...object[key], value];
					} else {
						object[key] = [value];
					}
				} else {
					object[key] = value;
				}

				return object;
			}, {} as Record<string, string[] | string>);

			delete objectSearchParams['json'];

			const params = { ...objectSearchParams, ...reducedJsonParams };

			({ logs, total } = await getLogs(params, collection));
		} else {
			({ logs, total } = await getLogs(objectSearchParams, collection));
		}

		return new Response(JSON.stringify({ logs, total }), { status: 200 });
	});
