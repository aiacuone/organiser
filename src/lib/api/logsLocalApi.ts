import { axios } from '$lib/general/axios'
import type { Log_int } from '$lib/types'

const resource = 'log'

export const updateLogClient = async (values: Log_int) => {
	await axios.patch(`/${resource}`, values)
}

export const deleteLogClient = async (id: string) => {
	await axios.delete(`/${resource}`, { data: { id } })
}

export const getDateLogsClient = async ({
	space,
	date,
	params
}: {
	space: string
	date: string
	params?: Record<'search' | 'skip', string>
}) => {
	const { data } = await axios.get(`/${resource}/${space}/${date}`, { params })
	return data
}

export const getLogsClient = async (params: {
	space?: string
	search?: string
	date?: Date
	skip?: number
}) => {
	const { data } = await axios.get(`/${resource}`, { params })
	return data
}

export const getTitlesAndReferencesClient = async (space: string) => {
	const { data } = await axios.get(`/${resource}/${space}/titlesAndReferences`)
	return data
}
