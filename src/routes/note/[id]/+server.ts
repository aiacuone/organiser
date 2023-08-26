import { createNote, deleteNote, updateNote } from '$lib';

export async function PATCH({ params, request, cookies }) {
	const { id } = params;
	const { title, content, space } = await request.json();
	updateNote({ id, title, content, space });

	return new Response(null, { status: 204 });
}

export async function DELETE({ params, request, cookies }) {
	const { id } = params;
	const { space } = await request.json();

	deleteNote({ id, space });

	return new Response(null, { status: 204 });
}

export async function POST({ params, request, cookies }) {
	const { id } = params;
	const { title, content, space } = await request.json();
	createNote({ id, title, content, space });

	return new Response(null, { status: 204 });
}
