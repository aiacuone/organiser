import type { LogType_enum } from '$lib/types';
import axios from 'axios';

const resource = 'log';

export const updateLog = async (values: {
	id: string;
	date: Date;
	title?: string;
	content: string | string[];
	reference?: string;
	time?: number;
	importance?: number;
	priority?: number;
	type: LogType_enum;
	space: string;
}) => {
	await axios.patch(`/${resource}`, values);
};

export const deleteLog = async (id: string) => {
	await axios.delete(`/${resource}`, { data: { id } });
};
