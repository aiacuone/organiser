export interface Space_int {
	name: string;
	color: string;
	notes: Array<Note_int>;
}

export interface Option_int {
	name: 'today' | 'yesterday' | 'history';
}

export interface Note_int {
	id: string;
	title: string;
	content: string;
	timestamp: number;
}

export interface SpaceData_int {
	spaces: Array<Space_int>;
	options: Array<Option_int>;
}
