import {
	checkAccessTokenMiddleware,
	deleteLog,
	getAndCheckCollectionFromToken,
	getLogs,
	updateLog
} from '$lib';

export async function PATCH({ request }) {
	const data = await request.json();

	await updateLog(data);

	return new Response(JSON.stringify(''), { status: 200 });
}

export const DELETE = async ({ request }) => {
	const { id } = await request.json();

	await deleteLog(id);

	return new Response(JSON.stringify(''), { status: 200 });
};

export const GET = async ({ request, url: { searchParams } }) =>
	checkAccessTokenMiddleware(request, async () => {
		const collection = await getAndCheckCollectionFromToken(request);
		console.log({ collection });

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

			({ logs, total } = await getLogs(params));
		} else {
			({ logs, total } = await getLogs(objectSearchParams));
		}

		return new Response(JSON.stringify({ logs, total }), { status: 200 });
	});
