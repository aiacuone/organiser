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
}

export enum LogType_enum {
	time = 'time',
	todo = 'todo',
	important = 'important',
	question = 'question'
}

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
