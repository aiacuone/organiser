<script lang="ts">
	import type { Note_int, SpaceData_int, Space_int, Time } from '$lib/types/general';
	import { getContext } from 'svelte';
	import { derived, type Readable } from 'svelte/store';
	import { page } from '$app/stores';
	import NewNote from '$lib/components/Note/NewNote.svelte';
	import NoteListItem from '$lib/components/Note/NoteListItem.svelte';
	import {
		getDayMonthYearFromDate,
		getTodaysDayMonthYear,
		getYesterdaysDayMonthYear
	} from '$lib/utils';
	import {
		useMutation,
		useQuery,
		useQueryClient,
		type MutationFunction,
		type UseQueryStoreResult
	} from '@sveltestack/svelte-query';
	import { createNote, deleteNote } from '$lib/api/notesLocalApi';
	import { getSpaces } from '$lib/api/spaceLocalApi';

	interface PageData extends SpaceData_int {
		time: string;
	}

	export let data: PageData;

	const queryClient = useQueryClient();

	const spaces: UseQueryStoreResult<unknown, any, Space_int[], 'spaces'> = useQuery(
		'spaces',
		getSpaces,
		{
			initialData: data.spaces
		}
	);

	const space: Readable<Space_int | undefined> = derived([page, spaces], ([$page, $spaces]) =>
		$page.params.space
			? $spaces.data?.find((space) => space.name === $page.params.space.replace('-', ' '))
			: $spaces.data?.[0]
	);

	const mutation = useMutation(createNote, {
		onSuccess: (data) => {
			queryClient.setQueryData('spaces', data);
		}
	});

	const onClickAccept = () => {
		$mutation.mutate({
			title: newNoteTitleValue,
			content: newNoteContentValue,
			space: $space?.name ?? ''
		});
	};

	const onClickDelete = (id: string) => {
		deleteNote({
			id,
			space: $space?.name ?? ''
		});
	};

	const filteredNotes = derived([page, space], ([$page, $space]) => {
		if (!$space) return [];
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
				<p class="capitalize text-opacity-40 text-black">{$space?.name}</p>
				<p class="text-opacity-40 text-black">-</p>
				<p class="capitalize">{data.time}</p>
			</div>
			{#if $page.params.time === 'today' || $page.params.time === 'yesterday'}
				<NewNote
					background={$space?.color ?? ''}
					{onClickAccept}
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
								onClickDelete={() => onClickDelete(note.id)}
								date={note.date}
							/>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
