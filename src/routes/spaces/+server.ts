import {
	checkAccessTokenMiddleware,
	getAndCheckCollectionFromToken,
	getSpaces
} from '$lib/server/index.js';

export const GET = async ({ request }) =>
	checkAccessTokenMiddleware(request, async () => {
		const collection = await getAndCheckCollectionFromToken(request);

		const spaces = await getSpaces(collection);

		return new Response(JSON.stringify(spaces), { status: 200 });
	});
