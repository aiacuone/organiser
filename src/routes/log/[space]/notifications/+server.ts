import { getLogNotifications } from '$lib';
import type { LogType_enum } from '$lib/types/general.js';

export const GET = async ({ params, url: { searchParams } }) => {
	const { space } = params;
	const _searchParams = new URLSearchParams(searchParams).entries();
	const types = Array.from(_searchParams).map(
		([type, value]) => type === 'type' && value
	) as LogType_enum[];

	const logNotifications = await getLogNotifications(space, types);

	return new Response(JSON.stringify(logNotifications), { status: 200 });
};
