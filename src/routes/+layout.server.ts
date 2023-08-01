export const load = async (req: Request, res: Response) => {
	return {
		spaces: [
			{
				name: 'aventus',
				color: 'blue'
			},
			{ name: 'eth lizards', color: 'green' },
			{ name: 'personal', color: 'gray' }
		],
		options: [{ name: 'today' }, { name: 'yesterday' }, { name: 'history' }]
	};
};
