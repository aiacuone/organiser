import { v4 as uuidv4 } from 'uuid';

const resource = 'note';

export async function createNote({
	title,
	content,
	space,
	date
}: {
	title: string;
	content: string;
	space: string;
	date: Date;
}) {
	const response = await fetch(`/${resource}/${uuidv4()}`, {
		method: 'POST',
		body: JSON.stringify({
			title,
			content,
			space,
			date
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const { spaces } = await response.json();
	return spaces;
}

export async function deleteNote({ id, space }: { id: string; space: string }) {
	const response = await fetch(`/${resource}/${id}`, {
		method: 'DELETE',
		body: JSON.stringify({ space }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const { spaces } = await response.json();
	return spaces;
}

export async function updateNote({
	title,
	content,
	space,
	id
}: {
	title: string;
	content: string;
	space: string;
	id: string;
}) {
	const response = await fetch(`/note/${id}`, {
		method: 'PATCH',
		body: JSON.stringify({ title, content, id, space }),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const { spaces } = await response.json();
	return spaces;
}
