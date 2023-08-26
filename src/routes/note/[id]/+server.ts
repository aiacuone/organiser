import { createNote, deleteNote, updateNote } from '$lib';

export async function PATCH({ params, request, cookies }) {
	const { id } = params;
	const { title, content, space } = await request.json();
	updateNote({ id, title, content, space });

	return new Response(null, { status: 204 });
}

export async function DELETE({ params, cookies }) {
	const { id } = params;
	deleteNote(id);

	return new Response(null, { status: 204 });
}

export async function POST({ params, request, cookies }) {
	const { id } = params;
	const { title, content, space } = await request.json();
	createNote({ id, title, content, space });

	return new Response(null, { status: 204 });
}
