import type { Space_int } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';

export const testSpaces: Array<Space_int> = [
	{
		name: 'aventus',
		href: 'aventus',
		color: 'blue',
		times: [
			{
				id: uuidv4(),
				title: 'test',
				content: ['test'],
				date: new Date(),
				time: 1,
				reference: 'test'
			},
			{
				id: uuidv4(),
				title: 'test 2',
				content: ['test 2'],
				date: new Date(),
				time: 2,
				reference: 'test 2'
			}
		],
		todos: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				isCompleted: false,
				priority: 1
			}
		],
		importants: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2
			}
		],
		questions: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2
			}
		]
	},
	{
		name: 'eth lizards',
		href: 'eth-lizards',
		color: 'green',
		times: [
			{
				id: uuidv4(),
				title: 'test',
				content: ['test'],
				date: new Date(),
				time: 1,
				reference: 'test'
			},
			{
				id: uuidv4(),
				title: 'test 2',
				content: ['test 2'],
				date: new Date(),
				time: 2,
				reference: 'test 2'
			}
		],
		todos: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				isCompleted: false,
				priority: 1
			}
		],
		importants: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2
			}
		],
		questions: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2
			}
		]
	},
	{
		name: 'daid',
		href: 'daid',
		color: 'gray',
		times: [
			{
				id: uuidv4(),
				title: 'test',
				content: ['test'],
				date: new Date(),
				time: 1,
				reference: 'test'
			},
			{
				id: uuidv4(),
				title: 'test 2',
				content: ['test 2'],
				date: new Date(),
				time: 2,
				reference: 'test 2'
			}
		],
		todos: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				isCompleted: false,
				priority: 1
			}
		],
		importants: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2
			}
		],
		questions: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2
			}
		]
	}
];
