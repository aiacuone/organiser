import { getSpaces } from '$lib';

export const GET = async () => {
	const spaces = await getSpaces();

	return new Response(JSON.stringify(spaces), { status: 200 });
};
