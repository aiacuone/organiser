import { createNote, deleteNote, updateNote } from '$lib';

export async function PATCH({ params, request }) {
	const { id } = params;
	const { title, content, space, time, date, reference } = await request.json();
	const { spaces } = await updateNote({ id, title, content, space, time, date, reference });

	return new Response(JSON.stringify({ spaces }), { status: 200 });
}

export async function DELETE({ params, request }) {
	const { id } = params;
	const { space } = await request.json();
	const { spaces } = await deleteNote({ id, space });

	return new Response(JSON.stringify({ spaces }), { status: 200 });
}

export async function POST({ params, request }) {
	const { id } = params;
	const { title, content, space, date, time, reference } = await request.json();
	const { spaces } = await createNote({ id, title, content, space, date, time, reference });

	return new Response(JSON.stringify({ spaces }), { status: 200 });
}
