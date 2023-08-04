export const load = async (req: Request, res: Response) => {
	return {
		time: req.url.pathname.split('/').pop().replace('-', ' ')
	};
};
