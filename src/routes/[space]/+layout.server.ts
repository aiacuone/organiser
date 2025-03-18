import { replaceAllHyphensWithSpaces } from '$lib/utils/strings';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (req: RequestEvent) => {
	return {
		space: replaceAllHyphensWithSpaces(req.url.pathname.split('/')[1])
	};
};
