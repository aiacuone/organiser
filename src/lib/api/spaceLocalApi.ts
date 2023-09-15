import { axios } from '$lib/general/axios';

const resource = 'space';

export async function getSpaces() {
	const response = await axios.get(`${resource}`);

	const spaces = response.data.spaces;
	return spaces;
}
