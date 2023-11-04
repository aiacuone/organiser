import { getDateFromHyphenatedString, getDateLogs } from '$lib';

export const GET = async ({ params }) => {
	const { space, date } = params;
	const logs = await getDateLogs({ space, date: getDateFromHyphenatedString(date) });

	return new Response(JSON.stringify(logs), { status: 200 });
};
