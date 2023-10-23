export const load = async (req: Request, res: Response) => {
	const dateFromUrl = req.url.pathname.split('/')[2];

	return {
		date: dateFromUrl
	};
};
