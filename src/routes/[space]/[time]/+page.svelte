<script lang="ts">
	import type { Note_int, SpaceData_int, Space_int, Time } from '../../../types/general';
	import NewNote from '../../../components/Note/New.svelte';
	import NoteListItem from '../../../components/Note/ListItem.svelte';
	import { getContext } from 'svelte';
	import { derived, type Readable } from 'svelte/store';
	import { page } from '$app/stores';
	import {
		getDayMonthYearFromDate,
		getTodaysDayMonthYear,
		getYesterdaysDayMonthYear
	} from '../../../utils';

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

	const filteredNotes = derived(page, ($page) => {
		const filterTodaysNotes = (note: Note_int) => {
			const { string: todaysDateString } = getTodaysDayMonthYear();
			const { string: noteDateString } = getDayMonthYearFromDate(note.date);
			return noteDateString === todaysDateString;
		};
		const filterYesterdaysNotes = (note: Note_int) => {
			const { string: noteDateString } = getDayMonthYearFromDate(note.date);
			const { string: yesterdayDateString } = getYesterdaysDayMonthYear();
			return noteDateString === yesterdayDateString;
		};

		const data: Record<Time, Note_int[]> = {
			today: $space.notes.filter(filterTodaysNotes),
			yesterday: $space.notes.filter(filterYesterdaysNotes),
			history: $space.notes
		};

		return data[$page.params.time as Time];
	});
</script>

<div class="h-full center stack">
	<div class="stack gap-6 w-full px-2 max-w-screen-md">
		<div class="center text-xl hStack gap-2">
			<p class="capitalize text-opacity-40 text-black">{$space.name}</p>
			<p class="text-opacity-40 text-black">-</p>
			<p class="capitalize">{data.time}</p>
		</div>
		{#if $page.params.time === 'today'}
			<NewNote background={$space.color} onClickTick={onAddNewNote} onClickReset={onResetNewNote} />
		{/if}
		<div class="w-full center rounded-md p-2" style="background:{$space?.color}">
			<div class="w-full stack gap-2 text-xs sm:text-sm md:text-md">
				{#if $filteredNotes.length === 0}
					<p class="text-opacity-40 text-black text-center">No notes for this date</p>
				{:else}
					{#each $filteredNotes as note}
						<NoteListItem
							subject={note.title}
							content={note.content}
							onClickEdit={() => onEditNote(note.id)}
							onClickDelete={() => onDeleteNote(note.id)}
						/>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
