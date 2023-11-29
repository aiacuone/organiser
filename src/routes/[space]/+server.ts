import { deleteSpace } from '$lib';

export const DELETE = async ({ params }) => {
	const { space } = params;

	await deleteSpace(space);

	return new Response(JSON.stringify({ message: 'Space deleted' }), { status: 200 });
};
