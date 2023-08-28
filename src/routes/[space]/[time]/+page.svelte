<script lang="ts">
	import { Time_enum, type Note_int, type SpaceData_int, type Space_int } from '$lib/types/general';
	import { setContext } from 'svelte';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';
	import NewNote from '$lib/components/Note/NewNote.svelte';
	import NoteListItem from '$lib/components/Note/NoteListItem.svelte';
	import {
		getDate2DaysEarlier,
		getDateFromHyphenatedString,
		getDayMonthYearFromDate,
		getTodaysDayMonthYear,
		getYesterdaysDate,
		getYesterdaysDayMonthYear
	} from '$lib/utils';
	import {
		useMutation,
		useQuery,
		useQueryClient,
		type UseQueryStoreResult
	} from '@sveltestack/svelte-query';
	import { createNote, deleteNote } from '$lib/api/notesLocalApi';
	import { getSpaces } from '$lib/api/spaceLocalApi';

	interface PageData extends SpaceData_int {
		time: Time_enum;
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

	setContext('space', space);

	const createNoteMutation = useMutation(createNote, {
		onSuccess: (data) => {
			queryClient.setQueryData('spaces', data);
		}
	});

	const deleteNoteMutation = useMutation(deleteNote, {
		onSuccess: (data) => {
			queryClient.setQueryData('spaces', data);
		}
	});

	const onClickAccept = () => {
		const timeData: Record<Time_enum, Date> = {
			[Time_enum.Today]: new Date(),
			[Time_enum.Yesterday]: getYesterdaysDate(),
			[Time_enum.History]: getDateFromHyphenatedString($datePickerValue)
		};

		$createNoteMutation.mutate({
			title: newNoteTitleValue,
			content: newNoteContentValue,
			space: $space?.name ?? '',
			date: timeData[data.time]
		});
	};

	const onClickDelete = (id: string) => {
		$deleteNoteMutation.mutate({
			id,
			space: $space?.name ?? ''
		});
	};

	const getInitialDatePickerValue = () => {
		const { day, month, year } = getDayMonthYearFromDate(getDate2DaysEarlier());
		return `${year}-${month}-${day}`;
	};

	const datePickerValue: Writable<string> = writable(getInitialDatePickerValue());

	const filteredNotes = derived(
		[page, space, datePickerValue],
		([$page, $space, $datePickerValue]) => {
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

			const filterDatePickerNotes = (note: Note_int) => {
				const dateFromDatePicker = getDateFromHyphenatedString($datePickerValue);
				if (!dateFromDatePicker) return false;

				const { string: datePickerDateString } = getDayMonthYearFromDate(dateFromDatePicker);
				const { string: noteDateString } = getDayMonthYearFromDate(note.date);
				return noteDateString === datePickerDateString;
			};

			const filteredTimeNotes: Record<Time_enum, Note_int[]> = {
				today: $space.notes.filter(filterTodaysNotes),
				yesterday: $space.notes.filter(filterYesterdaysNotes),
				history: $space.notes.filter(filterDatePickerNotes)
			};

			const time = $page.params.time as Time_enum;

			return filteredTimeNotes[time];
		}
	);

	let newNoteContentValue: string = '';
	let newNoteTitleValue: string = '';

	let headerContainer: number;
	let parentContainerHeight: number;
	let notesContainerHeight: number;
	$: parentContainerHeight, (notesContainerHeight = parentContainerHeight - headerContainer - 30);
</script>

<div class="h-full center stack" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-2 w-full px-2 max-w-screen-md h-full sm:h-auto justify-center">
		<div bind:clientHeight={headerContainer} class="stack gap-2">
			<div class="center text-xl hStack gap-2">
				<p class="capitalize text-opacity-40 text-black">{$space?.name}</p>
				<p class="text-opacity-40 text-black">-</p>
				<p class="capitalize">{data.time}</p>
			</div>
			{#if $page.params.time === 'history'}
				<div class="center">
					<input
						type="date"
						class="border border-gray-300 px-5 py-1 rounded"
						bind:value={$datePickerValue}
					/>
				</div>
			{/if}
			<NewNote
				background={$space?.color ?? ''}
				{onClickAccept}
				bind:titleValue={newNoteTitleValue}
				bind:contentValue={newNoteContentValue}
			/>
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
								onConfirmDelete={() => onClickDelete(note.id)}
								date={note.date}
							/>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
