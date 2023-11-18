import { axios } from '$lib/general/axios';
import type { Log_int } from '$lib/types';

const resource = 'log';

export const updateLog = async (values: Log_int) => {
	await axios.patch(`/${resource}`, values);
};

export const deleteLog = async (id: string) => {
	await axios.delete(`/${resource}`, { data: { id } });
};

export const getDateLogs = async ({
	space,
	date,
	params
}: {
	space: string;
	date: string;
	params?: Record<'search' | 'skip', string>;
}) => {
	const { data } = await axios.get(`/${resource}/${space}/${date}`, { params });
	return data;
};

export const getLogs = async (params: {
	space?: string;
	search?: string;
	date?: Date;
	skip?: number;
}) => {
	const { data } = await axios.get(`/${resource}`, { params });
	return data;
};

export const getTitlesAndReferences = async (space: string) => {
	const { data } = await axios.get(`/${resource}/${space}/titlesAndReferences`);
	return data;
};
