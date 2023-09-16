<script lang="ts">
	import { Time_enum, type Note_int, type SpaceData_int, type Space_int } from '$lib/types/general';
	import { setContext } from 'svelte';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';
	import NewNote from '$lib/components/Note/NewNote.svelte';
	import Note from '$lib/components/Note/Note.svelte';
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
	import { editNoteContentInputValue } from '$lib/stores';
	import Button from '$lib/components/Button.svelte';
	import Timestamp from '$lib/components/Note/Timestamp.svelte';

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

	const onClickAccept = ({ title, time }: { title: string; time: number }) => {
		const timeData: Record<Time_enum, Date> = {
			[Time_enum.Today]: new Date(),
			[Time_enum.Yesterday]: getYesterdaysDate(),
			[Time_enum.History]: getDateFromHyphenatedString($datePickerValue)
		};

		$createNoteMutation.mutate({
			title,
			content: $editNoteContentInputValue,
			space: $space?.name ?? '',
			date: timeData[data.time],
			time
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

	let headerContainer: number;
	let parentContainerHeight: number;
	let notesContainerHeight: number;
	$: parentContainerHeight, (notesContainerHeight = parentContainerHeight - headerContainer - 30);

	let exportedNotesModal: HTMLDialogElement;

	let showInNotesModalCheckboxes: Record<string, boolean> = {
		times: false,
		dates: false
	};

	let notesModalTextArea: HTMLDivElement;
	const copy = () => {
		const clipboardItem = new ClipboardItem({
			'text/plain': new Blob([notesModalTextArea.innerText.trim()], { type: 'text/plain' })
		});
		navigator.clipboard.write([clipboardItem]);
	};
</script>

<div class="h-full center stack" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-2 w-full px-2 max-w-screen-md h-full sm:h-auto justify-center">
		<div bind:clientHeight={headerContainer} class="stack gap-2">
			<div class="center text-xl hStack gap-2">
				<p class="capitalize text-opacity-40 text-black">{$space?.name}</p>
				<p class="text-opacity-40 text-black">-</p>
				<p class="capitalize">{data.time}</p>
			</div>
			<div class="center hStack gap-3">
				{#if $page.params.time === 'history'}
					<input
						type="date"
						class="border border-gray-300 px-5 py-1 rounded"
						bind:value={$datePickerValue}
					/>
				{/if}
				<Button
					onClick={() => exportedNotesModal.showModal()}
					isDisabled={$filteredNotes.length === 0}>Export</Button
				>
			</div>
			<NewNote background={$space?.color ?? ''} {onClickAccept} />
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
							<Note
								title={note.title}
								content={note.content}
								id={note.id}
								onConfirmDelete={() => onClickDelete(note.id)}
								date={note.date}
								time={note.time}
							/>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<dialog
	bind:this={exportedNotesModal}
	class="w-full max-w-[800px] p-5 sm:p-10 rounded-md h-screen sm:h-[auto]"
>
	<div class="stack justify-end h-full">
		<div class="hStack gap-3 justify-end align-center text-xs">
			<p>Show:</p>
			{#each Object.keys(showInNotesModalCheckboxes) as checkbox}
				<label class="center gap-1">
					{checkbox}
					<input type="checkbox" bind:checked={showInNotesModalCheckboxes[checkbox]} />
				</label>
			{/each}
		</div>
		<div class="stack gap-10 center h-full">
			<div class="stack gap-4" bind:this={notesModalTextArea}>
				{#each $filteredNotes as note, $index}
					{@const $last = $filteredNotes.length - 1 === $index}
					<div class="stack">
						<p class="capitalize">{note.title}</p>
						<p class="text-xs py-2 capitalize">{note.content}</p>
						{#if showInNotesModalCheckboxes.dates}
							<p class="text-opacity-30 text-black text-xs">
								<Timestamp date={note.date} />
							</p>
						{/if}
						{#if showInNotesModalCheckboxes.times}
							<p class="text-opacity-30 text-black text-xs">{note.time} h</p>
						{/if}
					</div>
					{#if !$last}
						<hr class="border-gray-100" />
					{/if}
				{/each}
			</div>
			<div class="flex flex-col sm:flex-row gap-4 center">
				<Button onClick={copy}>Copy</Button>
				<Button onClick={() => exportedNotesModal.close()}>Close</Button>
			</div>
		</div>
	</div>
</dialog>
