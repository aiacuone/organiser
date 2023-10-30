import { getFilteredLogs } from '$lib';

export const GET = async ({ params }) => {
	const { space, searchValue } = params;
	const filteredLogs = await getFilteredLogs({ space, value: searchValue });

	return new Response(JSON.stringify(filteredLogs), { status: 200 });
};
