import { getTitlesAndReferences } from '$lib';

export const GET = async ({ params }) => {
	const { space } = params;
	const titlesAndReferences = await getTitlesAndReferences(space);

	return new Response(JSON.stringify(titlesAndReferences), { status: 200 });
};
