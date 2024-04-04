import {
	checkAccessTokenMiddleware,
	getAndCheckCollectionFromToken,
	getTitlesAndReferences
} from '$lib/server/index.js';

export const GET = async ({ request, params }) =>
	checkAccessTokenMiddleware(request, async () =>
		getAndCheckCollectionFromToken(request, async (collection) => {
			const { space } = params;
			const titlesAndReferences = await getTitlesAndReferences(space, collection);

			return new Response(JSON.stringify(titlesAndReferences), { status: 200 });
		})
	);
