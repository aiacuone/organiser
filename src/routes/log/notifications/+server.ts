import { getAllLogNotifications } from '$lib';

export const GET = async ({ url: { searchParams } }) => {
	const result = new URLSearchParams(searchParams).entries();
	const params = Object.fromEntries(result);
	const spaces = Object.values(params);

	const allLogNotifications = await getAllLogNotifications(spaces);

	return new Response(JSON.stringify(allLogNotifications), { status: 200 });
};
