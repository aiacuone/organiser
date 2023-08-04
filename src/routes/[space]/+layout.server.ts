export const load = async (req: Request, res: Response) => {
	return {
		space: req.url.pathname.split('/')[1].replace('-', ' ')
	};
};
