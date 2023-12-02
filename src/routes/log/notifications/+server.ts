import { getAllLogNotifications } from '$lib';

export const GET = async ({ url: { searchParams } }) => {
	const result = new URLSearchParams(searchParams).entries();

	const spaces = Array.from(result, (x) => x[1]);

	const allLogNotifications = await getAllLogNotifications(spaces);

	return new Response(JSON.stringify(allLogNotifications), { status: 200 });
};
