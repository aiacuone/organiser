export interface Space_int {
	name: string;
	color: string;
}

export interface Option_int {
	name: 'today' | 'yesterday' | 'history';
}

export interface SpaceData_int {
	spaces: Array<Space_int>;
	options: Array<Option_int>;
}
