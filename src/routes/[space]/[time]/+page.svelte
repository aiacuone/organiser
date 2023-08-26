<script lang="ts">
	import type { Note_int, SpaceData_int, Space_int, Time } from '$lib/types/general';
	import { getContext } from 'svelte';
	import { derived, type Readable } from 'svelte/store';
	import { page } from '$app/stores';
	import { v4 as uuidv4 } from 'uuid';
	import NewNote from '$lib/components/Note/NewNote.svelte';
	import NoteListItem from '$lib/components/Note/NoteListItem.svelte';
	import {
		getDayMonthYearFromDate,
		getTodaysDayMonthYear,
		getYesterdaysDayMonthYear
	} from '$lib/utils';

	interface PageData extends SpaceData_int {
		time: string;
	}

	export let data: PageData;

	const space: Readable<Space_int> = getContext('space');

	const onCreateNote = () => {
		async function createNote() {
			await fetch(`/note/${uuidv4()}`, {
				method: 'POST',
				body: JSON.stringify({
					title: newNoteTitleValue,
					content: newNoteContentValue,
					space: $space.name
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		createNote();
	};

	const onDeleteNote = (id: string) => {
		async function deleteNote() {
			await fetch(`/note/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		deleteNote();
		console.log('delete note', id);
	};

	const filteredNotes = derived([page, space], ([$page, $space]) => {
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

		const filteredTimeNotes: Record<Time, Note_int[]> = {
			today: $space.notes.filter(filterTodaysNotes),
			yesterday: $space.notes.filter(filterYesterdaysNotes),
			history: $space.notes
		};

		const time = $page.params.time as Time;

		return filteredTimeNotes[time];
	});

	let newNoteContentValue: string = '';
	let newNoteTitleValue: string = '';

	let headerContainer: number;
	let parentContainerHeight: number;
	let notesContainerHeight: number;
	$: parentContainerHeight, (notesContainerHeight = parentContainerHeight - headerContainer - 30);
</script>

<div class="h-full center stack" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-2 w-full px-2 max-w-screen-md h-full sm:h-auto justify-center">
		<div bind:clientHeight={headerContainer}>
			<div class="center text-xl hStack gap-2">
				<p class="capitalize text-opacity-40 text-black">{$space.name}</p>
				<p class="text-opacity-40 text-black">-</p>
				<p class="capitalize">{data.time}</p>
			</div>
			{#if $page.params.time === 'today' || $page.params.time === 'yesterday'}
				<NewNote
					background={$space.color}
					onClickAccept={onCreateNote}
					bind:contentValue={newNoteContentValue}
					bind:subjectValue={newNoteTitleValue}
				/>
			{/if}
		</div>
		<div class="stack gap-6">
			<div
				class="w-full rounded-sm p-2 overflow-y-scroll hide-scrollbar"
				style="background:{$space?.color}; max-height:{notesContainerHeight}px"
			>
				<div class="w-full stack gap-2 text-xs sm:text-sm md:text-md">
					{#if $filteredNotes.length === 0}
						<p class="text-opacity-40 text-black text-center">No notes for this date</p>
					{:else}
						{#each $filteredNotes as note}
							<NoteListItem
								title={note.title}
								content={note.content}
								id={note.id}
								onClickDelete={() => onDeleteNote(note.id)}
								date={note.date}
							/>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
