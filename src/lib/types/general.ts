export type Time_type = 'today' | 'yesterday' | 'history';

export interface Space_int {
	name: string;
	color: string;
	notes: Array<Note_int>;
}

export interface Option_int {
	name: Time_type;
}

export interface Note_int {
	id: string;
	title: string;
	content: string;
	date: Date;
}

export interface SpaceData_int {
	spaces: Array<Space_int>;
	times: Array<Option_int>;
}
