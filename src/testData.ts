import { LogType_enum } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';

export const testSpaces = [
	{
		name: 'aventus',
		href: 'aventus',
		color: 'blue',
		times: [
			{
				id: uuidv4(),
				title: 'title 1',
				content: [
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut feugiat lorem. Quisque ornare dolor sed neque consectetur, a varius augue placerat. Vivamus et lobortis turpis. Fusce sit amet tortor dolor. Fusce efficitur lacus tempor, semper sem et, eleifend felis. Vestibulum eu tincidunt tellus. Vestibulum massa nulla, lacinia id aliquet.',
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut feugiat lorem. Quisque ornare dolor sed neque consectetur, a varius augue placerat. Vivamus et lobortis turpis. Fusce sit amet tortor dolor. Fusce efficitur lacus tempor, semper sem et, eleifend felis. Vestibulum eu tincidunt tellus. Vestibulum massa nulla, lacinia id aliquet.'
				],
				date: new Date(),
				time: 1,
				reference: 'reference 1',
				type: LogType_enum.time
			},
			{
				id: uuidv4(),
				title: 'test 2',
				content: ['test 2'],
				date: new Date(),
				time: 2,
				reference: 'test 2',
				type: LogType_enum.time
			}
		],
		todos: [
			{
				id: uuidv4(),
				content: 'Asks things about stuff',
				date: new Date(),
				isCompleted: false,
				priority: 1,
				type: LogType_enum.todo
			}
		],
		importants: [
			{
				id: uuidv4(),
				content: 'A very important thing that you need to remember',
				date: new Date(),
				importance: 1,
				type: LogType_enum.important
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 3,
				type: LogType_enum.important
			}
		],
		questions: [
			{
				id: uuidv4(),
				content: 'Why is life',
				date: new Date(),
				importance: 1,
				type: LogType_enum.question
			},
			{
				id: uuidv4(),
				content: 'How did we get here',
				date: new Date(),
				importance: 2,
				type: LogType_enum.question
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
				reference: 'test',
				type: LogType_enum.time
			},
			{
				id: uuidv4(),
				title: 'test 2',
				content: ['test 2'],
				date: new Date(),
				time: 2,
				reference: 'test 2',
				type: LogType_enum.time
			}
		],
		todos: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				isCompleted: false,
				priority: 1,
				type: LogType_enum.todo
			}
		],
		importants: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1,
				type: LogType_enum.important
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2,
				type: LogType_enum.important
			}
		],
		questions: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1,
				type: LogType_enum.question
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2,
				type: LogType_enum.question
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
				reference: 'test',
				type: LogType_enum.time
			},
			{
				id: uuidv4(),
				title: 'test 2',
				content: ['test 2'],
				date: new Date(),
				time: 2,
				reference: 'test 2',
				type: LogType_enum.time
			}
		],
		todos: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				isCompleted: false,
				priority: 1,
				type: LogType_enum.todo
			}
		],
		importants: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1,
				type: LogType_enum.important
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2,
				type: LogType_enum.important
			}
		],
		questions: [
			{
				id: uuidv4(),
				content: 'test',
				date: new Date(),
				importance: 1,
				type: LogType_enum.question
			},
			{
				id: uuidv4(),
				content: 'test 2',
				date: new Date(),
				importance: 2,
				type: LogType_enum.question
			}
		]
	}
];
