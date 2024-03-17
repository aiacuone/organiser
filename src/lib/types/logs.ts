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
	reference = 'reference',
	time = 'time',
	type = 'type',
	space = 'space',
	listItems = 'listItems',
	checkboxItems = 'checkboxItems',
	lastUpdated = 'lastUpdated',
	rating = 'rating',
	questions = 'questions',
	listType = 'listType'
}

export interface Log_int {
	[Log_enum.id]: string;
	[Log_enum.date]: Date;
	[Log_enum.title]?: string;
	[Log_enum.reference]?: string;
	[Log_enum.time]?: number;
	[Log_enum.type]: LogType_enum;
	[Log_enum.space]: string;
	[Log_enum.listItems]?: string[];
	[Log_enum.checkboxItems]?: CheckboxItem_int[];
	[Log_enum.lastUpdated]?: Date;
	[Log_enum.rating]?: 1 | 2 | 3;
	[Log_enum.questions]?: QuestionItem_int[];
	[Log_enum.listType]?: LogListType_enum;
}

export const logEnumNames: Record<Log_enum, string> = {
	[Log_enum.id]: 'ID',
	[Log_enum.date]: 'Date',
	[Log_enum.title]: 'Title',
	[Log_enum.reference]: 'Reference',
	[Log_enum.time]: 'Time',
	[Log_enum.type]: 'Type',
	[Log_enum.space]: 'Space',
	[Log_enum.lastUpdated]: 'Last Updated',
	[Log_enum.rating]: 'Rating',
	[Log_enum.listItems]: 'List Items',
	[Log_enum.checkboxItems]: 'Checkbox Items',
	[Log_enum.questions]: 'Questions',
	[Log_enum.listType]: 'List Type'
};

export enum LogType_enum {
	time = 'time',
	todo = 'todo',
	important = 'important',
	question = 'question',
	list = 'list'
}

export const logTypeEnumNames: Record<LogType_enum, string> = {
	time: 'Time',
	todo: 'Todo',
	important: 'Important',
	question: 'Question',
	list: 'List'
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

export interface ListItem_int {
	item: string;
}

export interface CheckboxItem_int {
	isChecked: boolean;
	text: string;
}

export interface QuestionItem_int {
	question: string;
	answer?: string;
}

export interface TodoLog_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.todo;
	[Log_enum.listItems]: CheckboxItem_int[];
	[Log_enum.rating]: 1 | 2 | 3;
}
export interface TimeLog_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.time;
	[Log_enum.listItems]: string[];
}

export interface Important_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.important;
	[Log_enum.listItems]: string[];
	[Log_enum.rating]: 1 | 2 | 3;
}
export interface Question_int extends LogBase_int {
	[Log_enum.type]: LogType_enum.question;
	[Log_enum.rating]: 1 | 2 | 3;
}

export const searchableInputs = [
	Log_enum.title,
	Log_enum.reference,
	Log_enum.questions,
	Log_enum.listItems,
	Log_enum.checkboxItems
	// todo: add list items some how?
];

export const allLogInputs = searchableInputs.map((key) => key as Log_enum);

export interface BaseMappedListItem_int {
	id: number;
}

export enum LogListType_enum {
	checkbox = 'checkbox',
	unordered = 'unordered',
	ordered = 'ordered'
}

export const allLogListTypes = Object.values(LogListType_enum).map(
	(key) => key as LogListType_enum
);

export type MappedCheckboxItem = BaseMappedListItem_int & CheckboxItem_int;
export type MappedListItem = BaseMappedListItem_int & ListItem_int;
export type MappedQuestionItem = BaseMappedListItem_int & QuestionItem_int;
