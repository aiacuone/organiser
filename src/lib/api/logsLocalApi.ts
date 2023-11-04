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

export const getFilteredLogs = async ({ space, value }: { space: string; value: string }) => {
	const { data } = await axios.get(`/${resource}/${space}/search/${value}`);
	return data;
};

// export const getReferences = async (space: string) => {
// 	const { data } = await axios.get(`/${resource}/${space}/references`);
// 	return data;
// };

// export const getTitles = async (space: string) => {
// 	const { data } = await axios.get(`/${resource}/${space}/titles`);
// 	return data;
// };

export const getTitlesAndReferences = async (space: string) => {
	const { data } = await axios.get(`/${resource}/${space}/titlesAndReferences`);
	return data;
};
