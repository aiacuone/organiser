export const load = async (req: Request, res: Response) => {
	return {
		spaces: [
			{
				name: 'aventus',
				color: '#B6D0E2'
			},
			{ name: 'eth lizards', color: '#C1E1C1' },
			{ name: 'personal', color: '#E5E4E2' }
		],
		options: [{ name: 'today' }, { name: 'yesterday' }, { name: 'history' }]
	};
};
