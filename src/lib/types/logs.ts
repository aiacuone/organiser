export interface SpaceData_int {
	spaces: string[];
	space: string;
	date: string;
	initialLogNotifications: Log_int[];
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
	isCompleted = 'isCompleted',
	bullets = 'bullets',
	lastUpdated = 'lastUpdated',
	question = 'question',
	answer = 'answer',
	todos = 'todos',
	rating = 'rating'
}

export interface Log_int {
	[Log_enum.id]: string;
	[Log_enum.date]: Date;
	[Log_enum.title]?: string;
	[Log_enum.content]?: string;
	[Log_enum.reference]?: string;
	[Log_enum.time]?: number;
	[Log_enum.type]: LogType_enum;
	[Log_enum.space]: string;
	[Log_enum.isCompleted]?: boolean;
	[Log_enum.bullets]?: string[];
	[Log_enum.lastUpdated]?: Date;
	[Log_enum.question]?: string;
	[Log_enum.answer]?: string;
	[Log_enum.todos]?: Todo_int[];
	[Log_enum.rating]?: 1 | 2 | 3;
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
	[Log_enum.isCompleted]: 'Completed',
	[Log_enum.bullets]: 'Bullets',
	[Log_enum.lastUpdated]: 'Last Updated',
	[Log_enum.question]: 'Question',
	[Log_enum.answer]: 'Answer',
	[Log_enum.todos]: 'Todos',
	[Log_enum.rating]: 'Rating'
};

export const allLogs = Object.keys(LogType_enum).map((key) => key);

export interface LogBase_int {
	[Log_enum.id]: string;
	[Log_enum.date]: Date;
	[Log_enum.space]: string;
	[Log_enum.title]: string;
	[Log_enum.reference]: string;
	[Log_enum.time]: number;
}
export interface Todo_int {
	[Log_enum.isCompleted]: boolean;
	[Log_enum.content]: string;
}
export interface TodoLog_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.todo;
	[Log_enum.isCompleted]: boolean;
	[Log_enum.todos]: Todo_int[];
	[Log_enum.rating]: 1 | 2 | 3;
}
export interface TimeLog_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.time;
	[Log_enum.bullets]: string[];
}

export interface Important_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.important;
	[Log_enum.content]: string;
	[Log_enum.rating]: 1 | 2 | 3;
}
export interface Question_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.question;
	[Log_enum.question]: string;
	[Log_enum.answer]: string;
	[Log_enum.rating]: 1 | 2 | 3;
}

export const searchableInputs = [
	Log_enum.title,
	Log_enum.reference,
	Log_enum.question,
	Log_enum.answer,
	Log_enum.content
];

export const allLogInputs = searchableInputs.map((key) => key as Log_enum);
