import { deleteLog, updateLog } from '$lib';

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
