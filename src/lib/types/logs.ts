export enum Time_enum {
	Today = 'today',
	Yesterday = 'yesterday',
	Date = 'date'
}

export interface Option_int {
	name: Time_enum;
	href: string;
}

export interface SpaceData_int {
	spaces: string[];
	times: Array<Option_int>;
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

export interface LogBase_int<T = string> {
	id: string;
	date: Date;
	content: T;
}
export interface TimeLog_int extends LogBase_int<string[]> {
	title: string;
	reference: string;
	time: number;
	type: LogType_enum.time;
}

export interface Todo_int extends LogBase_int {
	isCompleted: boolean;
	priority: 1 | 2 | 3;
	type: LogType_enum.todo;
}

export interface Important_int extends LogBase_int {
	importance: 1 | 2 | 3;
	type: LogType_enum.important;
}
export interface Question_int extends LogBase_int {
	importance: 1 | 2 | 3;
	type: LogType_enum.question;
}

export const searchableInputs = [
	Log_enum.title,
	Log_enum.reference,
	Log_enum.question,
	Log_enum.answer,
	Log_enum.content
];

export const allLogInputs = searchableInputs.map((key) => key as Log_enum);
