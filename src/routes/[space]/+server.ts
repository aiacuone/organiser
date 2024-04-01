import {
	checkAccessTokenMiddleware,
	deleteSpace,
	getAndCheckCollectionFromToken
} from '$lib/server/index.js';

export const DELETE = async ({ request, params }) =>
	checkAccessTokenMiddleware(request, async () => {
		const collection = await getAndCheckCollectionFromToken(request);

		const { space } = params;

		await deleteSpace(space, collection);

		return new Response(JSON.stringify({ message: 'Space deleted' }), { status: 200 });
	});
