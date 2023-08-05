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
					date: new Date()
				},
				{
					id: uuidv4(),
					title: 'test 2',
					content: 'test content for note test 2 aventus',
					date: new Date()
				},
				{
					id: uuidv4(),
					title: 'test 3',
					content: 'test content for note test 3 aventus',
					date: new Date()
				}, // replicate this 6 more times
				{
					id: uuidv4(),
					title: 'test 4',
					content: 'test content for note test 4 aventus',
					date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
				},
				{
					id: uuidv4(),
					title: 'test 5',
					content: 'test content for note test 5 aventus',
					date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
				},
				{
					id: uuidv4(),
					title: 'test 6',
					content: 'test content for note test 6 aventus',
					date: 'Thu Aug 03 2023 20:00:47 GMT+0100 (British Summer Time)'
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
					date: new Date()
				},
				{
					id: uuidv4(),
					title: 'test 4',
					content: 'test content for note test 4 eth lizards',
					date: new Date()
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
					date: new Date()
				},
				{
					id: uuidv4(),
					title: 'test 6',
					content: 'test content for note test 6 personal',
					date: new Date()
				},
				{
					id: uuidv4(),
					title: 'test 7',
					content: 'test content for note test 7 personal',
					date: new Date()
				}
			]
		}
	],
	times: [{ name: 'today' }, { name: 'yesterday' }, { name: 'history' }]
};
