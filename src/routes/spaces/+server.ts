export const GET = async ({ locals }: RequestEvent) => {
	const { collection } = locals

	const spaces = await collection.distinct('space')

	return new Response(JSON.stringify(spaces), { status: 200 })
}
