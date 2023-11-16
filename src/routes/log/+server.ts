import { deleteLog, getLogs, updateLog } from '$lib';
import { getObjectWithParsedValues } from '$lib/utils/parse.js';

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

export const GET = async ({ url: { searchParams } }) => {
	const result = new URLSearchParams(searchParams).entries();

	const params = Object.fromEntries(result);

	const parsedParams = getObjectWithParsedValues(params);

	const logs = await getLogs(parsedParams);

	return new Response(JSON.stringify(logs), { status: 200 });
};
