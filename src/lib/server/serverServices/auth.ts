export const checkAccessTokenMiddleware = async (
	req: Request,
	callback: () => Promise<Response>
): Promise<Response> => {
	const token = req.headers.get('authorization')

	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
	}

	return callback()
}

export const getSubstringToken = (token: string): string => {
	return token.substring(7)
}
