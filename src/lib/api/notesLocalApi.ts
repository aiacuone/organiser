import { axios } from '$lib/general/axios';
import { v4 as uuidv4 } from 'uuid';

const resource = 'note';

export async function createNote({
	title,
	content,
	space,
	date,
	time
}: {
	title: string;
	content: string;
	space: string;
	date: Date;
	time: number;
}) {
	const response = await axios.post(`${resource}/${uuidv4()}`, {
		title,
		content,
		space,
		date,
		time
	});
	const spaces = response.data.spaces;
	return spaces;
}

export async function deleteNote({ id, space }: { id: string; space: string }) {
	const response = await axios.delete(`/${resource}/${id}`, {
		data: { space }
	});
	const spaces = response.data.spaces;
	return spaces;
}

export async function updateNote({
	title,
	content,
	space,
	id,
	time,
	date
}: {
	title: string;
	content: string;
	space: string;
	id: string;
	time: number;
	date: Date;
}) {
	const response = await axios.patch(`/${resource}/${id}`, {
		title,
		content,
		space,
		id,
		time,
		date
	});

	const spaces = response.data.spaces;
	return spaces;
}
