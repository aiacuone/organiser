export enum Time_enum {
	Today = 'today',
	Yesterday = 'yesterday',
	History = 'history'
}

export interface Space_int {
	name: string;
	href: string;
	color: string;
	times: Array<TimeLog_int>;
	todos: Array<Todo_int>;
	importants: Array<Important_int>;
	questions: Array<Question_int>;
}

export interface Option_int {
	name: Time_enum;
}

export interface Note_int {
	id: string;
	title: string;
	content: string;
	date: Date;
	time: number;
	reference: string;
}

export interface SpaceData_int {
	spaces: string[];
	times: Array<Option_int>;
	space: string;
	date: string;
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
