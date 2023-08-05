import { v4 as uuidv4 } from 'uuid';

export const testData = {
	spaces: [
		{
			name: 'aventus',
			color: '#B6D0E2',
			notes: [
				{
					id: uuidv4(),
					title: 'test 1',
					content:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae enim ut milobortis commodo vitae ut justo. Etiam rutrum ligula justo, sit amet elementum sapienultrices eu. Praesent sit amet nisl volutpat quam fermentum suscipit. Aenean sodales antesed enim porta, sit amet viverra nulla porta. Curabitur sodales pharetra.',
					timestamp: 1620936000000
				},
				{
					id: uuidv4(),
					title: 'test 2',
					content: 'test content for note test 2 aventus',
					timestamp: 1620936000000
				}
			]
		},
		{
			name: 'eth lizards',
			color: '#C1E1C1',
			notes: [
				{
					id: uuidv4(),
					title: 'test 3',
					content: 'test content for note test 3 eth lizards',
					timestamp: 1620936000000
				},
				{
					id: uuidv4(),
					title: 'test 4',
					content: 'test content for note test 4 eth lizards',
					timestamp: 1620936000000
				}
			]
		},
		{
			name: 'personal',
			color: '#E5E4E2',
			notes: [
				{
					id: uuidv4(),
					title: 'test 5',
					content: 'test content for note test 5 personal',
					timestamp: 1620936000000
				},
				{
					id: uuidv4(),
					title: 'test 6',
					content: 'test content for note test 6 personal',
					timestamp: 1620936000000
				},
				{
					id: uuidv4(),
					title: 'test 7',
					content: 'test content for note test 7 personal',
					timestamp: 1620936000000
				}
			]
		}
	],
	options: [{ name: 'today' }, { name: 'yesterday' }, { name: 'history' }]
};
