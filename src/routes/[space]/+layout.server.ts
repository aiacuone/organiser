export const load = async (req: Request, res: Response) => {
	console.log({ req }, 'server');
	// console.log({ pathname: req.url.pathname });

	return {
		test: ''
	};
};
