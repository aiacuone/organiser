import { getSpaces } from '$lib';

export async function GET() {
	const spaces = await getSpaces();

	return new Response(JSON.stringify({ spaces }), { status: 200 });
}
