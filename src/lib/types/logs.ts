export interface SpaceData_int {
	spaces: string[];
	space: string;
	date: string;
	initialLogNotifications: Log_int[];
}

export interface Log_int {
	id: string;
	date: Date;
	title?: string;
	content?: string;
	reference?: string;
	time?: number;
	type: LogType_enum;
	space: string;
	priority?: number;
	importance?: number;
	isCompleted?: boolean;
	bullets?: string[];
	lastUpdated?: Date;
	question?: string;
	answer?: string;
	todos?: Todo_int[];
}
export enum Log_enum {
	id = 'id',
	date = 'date',
	title = 'title',
	content = 'content',
	reference = 'reference',
	time = 'time',
	type = 'type',
	space = 'space',
	priority = 'priority',
	importance = 'importance',
	isCompleted = 'isCompleted',
	bullets = 'bullets',
	lastUpdated = 'lastUpdated',
	question = 'question',
	answer = 'answer'
}

export enum LogType_enum {
	time = 'time',
	todo = 'todo',
	important = 'important',
	question = 'question'
}

export const logEnumNames: Record<Log_enum, string> = {
	[Log_enum.id]: 'ID',
	[Log_enum.date]: 'Date',
	[Log_enum.title]: 'Title',
	[Log_enum.content]: 'Content',
	[Log_enum.reference]: 'Reference',
	[Log_enum.time]: 'Time',
	[Log_enum.type]: 'Type',
	[Log_enum.space]: 'Space',
	[Log_enum.priority]: 'Priority',
	[Log_enum.importance]: 'Importance',
	[Log_enum.isCompleted]: 'Completed',
	[Log_enum.bullets]: 'Bullets',
	[Log_enum.lastUpdated]: 'Last Updated',
	[Log_enum.question]: 'Question',
	[Log_enum.answer]: 'Answer'
};

export const allLogs = Object.keys(LogType_enum).map((key) => key);

export interface LogBase_int {
	id: string;
	date: Date;
	space: string;
	title: string;
	reference: string;
	time: number;
}
export interface TimeLog_int extends LogBase_int {
	type: LogType_enum.time;
	bullets: string[];
}

export interface Todo_int {
	isCompleted: boolean;
	content: string;
}

export interface TodoLog_int extends LogBase_int {
	type: LogType_enum.todo;
	isCompleted: boolean;
	rating: 1 | 2 | 3;
	todos: Todo_int[];
}

export interface Important_int extends LogBase_int {
	type: LogType_enum.important;
	rating: 1 | 2 | 3;
	fact: string;
}
export interface Question_int extends LogBase_int {
	type: LogType_enum.question;
	rating: 1 | 2 | 3;
	question: string;
	answer: string;
}

export const searchableInputs = [
	Log_enum.title,
	Log_enum.reference,
	Log_enum.question,
	Log_enum.answer,
	Log_enum.content
];

export const allLogInputs = searchableInputs.map((key) => key as Log_enum);
