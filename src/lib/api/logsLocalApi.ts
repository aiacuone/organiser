import { axios } from '$lib/general/axios';
import type { Log_int } from '$lib/types';

const resource = 'log';

export const updateLog = async (values: Log_int) => {
	await axios.patch(`/${resource}`, values);
};

export const deleteLog = async (id: string) => {
	await axios.delete(`/${resource}`, { data: { id } });
};

export const getDateLogs = async ({ space, date }: { space: string; date: string }) => {
	const { data } = await axios.get(`/${resource}/${space}/${date}`);
	return data;
};
