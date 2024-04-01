import {
	checkAccessTokenMiddleware,
	getAndCheckCollectionFromToken,
	getTitlesAndReferences
} from '$lib/server/index.js';

export const GET = async ({ request, params }) =>
	checkAccessTokenMiddleware(request, async () => {
		const collection = await getAndCheckCollectionFromToken(request);

		const { space } = params;
		const titlesAndReferences = await getTitlesAndReferences(space, collection);

		return new Response(JSON.stringify(titlesAndReferences), { status: 200 });
	});
