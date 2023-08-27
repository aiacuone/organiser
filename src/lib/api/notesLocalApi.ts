import { v4 as uuidv4 } from 'uuid';

const resource = 'note';

export async function createNote({
	title,
	content,
	space
}: {
	title: string;
	content: string;
	space: string;
}) {
	const response = await fetch(`/${resource}/${uuidv4()}`, {
		method: 'POST',
		body: JSON.stringify({
			title,
			content,
			space
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
