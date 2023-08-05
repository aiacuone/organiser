<script lang="ts">
	import type { SpaceData_int, Space_int } from '../../../types/general';
	import NewNote from '../../../components/Note/New.svelte';
	import NoteListItem from '../../../components/Note/ListItem.svelte';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	interface PageData extends SpaceData_int {
		time: string;
	}

	export let data: PageData;

	const space: Readable<Space_int> = getContext('space');

	const onAddNewNote = () => {
		console.log('add new note');
	};
	const onResetNewNote = () => {
		console.log('reset new note');
	};
	const onEditNote = (id: string) => {
		console.log('edit note', id);
	};
	const onDeleteNote = (id: string) => {
		console.log('delete note', id);
	};
</script>

<div class="h-full center stack">
	<div class="stack gap-2 w-full px-2 max-w-screen-md">
		<div class="center text-xl hStack gap-2">
			<p class="capitalize text-opacity-40 text-black">{$space.name}</p>
			<p class="text-opacity-40 text-black">-</p>
			<p class="capitalize">{data.time}</p>
		</div>
		<NewNote background={$space.color} onClickTick={onAddNewNote} onClickReset={onResetNewNote} />
		<div class="w-full center rounded-md p-2" style="background:{$space?.color}">
			<div class="w-full stack gap-2 text-xs sm:text-sm md:text-md">
				{#each $space.notes as note}
					<NoteListItem
						subject={note.title}
						content={note.content}
						onClickEdit={() => onEditNote(note.id)}
						onClickDelete={() => onDeleteNote(note.id)}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>
