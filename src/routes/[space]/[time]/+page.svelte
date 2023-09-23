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
	import Button from '$lib/components/Button.svelte';
	import Timestamp from '$lib/components/Note/Timestamp.svelte';
	import { darkMode } from '$lib/stores';

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

	const onClickAccept = ({
		title,
		time,
		reference,
		content
	}: {
		title: string;
		time: number;
		reference: string;
		content: string;
	}) => {
		const timeData: Record<Time_enum, Date> = {
			[Time_enum.Today]: new Date(),
			[Time_enum.Yesterday]: getYesterdaysDate(),
			[Time_enum.History]: getDateFromHyphenatedString($datePickerValue)
		};

		$createNoteMutation.mutate({
			title,
			content,
			space: $space?.name ?? '',
			date: timeData[data.time],
			time,
			reference
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

	$: headerContainer = 0;
	$: parentContainerHeight = 0;
	$: newNoteContainerHeight = 0;

	$: notesContainerHeight = parentContainerHeight - headerContainer - newNoteContainerHeight - 30;

	let exportedNotesModal: HTMLDialogElement;

	const defaultModalCheckboxes = {
		bullets: true,
		'include title': true,
		'include reference': true,
		titles: false,
		times: false,
		dates: false,
		dividers: false
	};

	let showInNotesModalCheckboxes: Record<string, boolean> = { ...defaultModalCheckboxes };

	const resetCheckboxes = () => {
		showInNotesModalCheckboxes = { ...defaultModalCheckboxes };
	};

	let notesModalTextArea: HTMLDivElement;
	const copy = () => {
		const clipboardItem = new ClipboardItem({
			'text/plain': new Blob([notesModalTextArea.innerText.trim()], { type: 'text/plain' })
		});
		navigator.clipboard.write([clipboardItem]);
	};
	$: modalContainerHeight = 0;
	$: modalCheckboxContainerHeight = 0;
	$: modalButtonContainerHeight = 0;
	$: modalMainContentHeight =
		modalContainerHeight - modalCheckboxContainerHeight - modalButtonContainerHeight - 20;
</script>

<div class="flex-1 center stack" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-2 w-full px-2 max-w-screen-md h-full sm:h-auto justify-center flex-1">
		<div bind:clientHeight={headerContainer} class="stack gap-2">
			<div class="hStack gap-1 sm:gap-2 center flex-wrap">
				<div class="center text-base sm:text-xl hStack gap-1 sm:gap-2">
					<p class="capitalize text-opacity-40">{$space?.name}</p>
					<p class="text-opacity-40">-</p>
					<p class="capitalize">{data.time}</p>
				</div>
				<Button
					className="text-black"
					onClick={() => exportedNotesModal.showModal()}
					isDisabled={$filteredNotes.length === 0}>Export</Button
				>
			</div>
			<div class="center hStack gap-3">
				{#if $page.params.time === 'history'}
					<input
						type="date"
						class="border border-gray-300 px-5 py-[1px] rounded text-black"
						bind:value={$datePickerValue}
					/>
				{/if}
			</div>
		</div>
		<div class="stack gap-6">
			<div
				class="w-full rounded-md p-1 overflow-y-scroll hide-scrollbar"
				style="background:{$space?.color}"
			>
				<div
					class="w-full h-full stack gap-1 text-xs sm:text-sm md:text-md overflow-y-scroll hide-scrollbar"
					style="max-height:{notesContainerHeight}px"
				>
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
								reference={note.reference}
							/>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		<div bind:clientHeight={newNoteContainerHeight}>
			<NewNote background={$space?.color ?? ''} {onClickAccept} />
		</div>
	</div>
</div>

<dialog
	bind:this={exportedNotesModal}
	class="w-full max-w-[800px] p-5 sm:p-10 rounded-md h-screen sm:h-[auto]"
	style={$darkMode.boolean ? $darkMode.darkStyles.string : $darkMode.lightStyles.string}
>
	<div class="stack justify-end h-full gap-4" bind:clientHeight={modalContainerHeight}>
		<div class="stack gap-2">
			<div
				class="hStack gap-3 justify-end align-center text-xs flex-wrap"
				bind:clientHeight={modalCheckboxContainerHeight}
			>
				<p>Show:</p>
				{#each Object.keys(showInNotesModalCheckboxes) as checkbox}
					<label class="center gap-1 capitalize">
						{checkbox}
						<input type="checkbox" bind:checked={showInNotesModalCheckboxes[checkbox]} />
					</label>
				{/each}
			</div>
			<Button className="text-black text-xs self-end" onClick={resetCheckboxes}>Reset</Button>
		</div>
		<div
			class="stack gap-10 center h-full overflow-y-scroll hide-scrollbar"
			style="height:{modalMainContentHeight}px"
		>
			<div class="stack gap-2 sm:gap-4" bind:this={notesModalTextArea}>
				{#each $filteredNotes as note, $index}
					{@const $last = $filteredNotes.length - 1 === $index}
					<div class="stack text-xs sm:text-sm">
						{#if showInNotesModalCheckboxes.titles}
							<p class="capitalize font-bold">{note.title}</p>
						{/if}
						<div class="flex">
							<p class="capitalize">
								{#if showInNotesModalCheckboxes.bullets}
									•
								{/if}
								{#if showInNotesModalCheckboxes['include title'] && note.title}
									<b>{note.title}.</b>
								{/if}
								{#if showInNotesModalCheckboxes['include reference'] && note.reference}
									<b>{note.reference}.</b>
								{/if}
								{note.content}
							</p>
						</div>
						{#if showInNotesModalCheckboxes.dates}
							<div
								class="text-opacity-30 {$darkMode.boolean
									? `text-${$darkMode.darkStyles.color}`
									: `text-${$darkMode.lightStyles.color}`}"
							>
								<Timestamp date={note.date} />
							</div>
						{/if}
						{#if showInNotesModalCheckboxes.times}
							<p
								class="text-opacity-30 text-xs {$darkMode.boolean
									? `text-${$darkMode.darkStyles.color}`
									: `text-${$darkMode.lightStyles.color}`}"
							>
								{note.time} h
							</p>
						{/if}
					</div>
					{#if !$last && showInNotesModalCheckboxes.dividers}
						<hr class="border-gray-100" />
					{/if}
				{/each}
			</div>
		</div>
		<div class="flex flex-wrap gap-4 center" bind:clientHeight={modalButtonContainerHeight}>
			<Button onClick={copy} className="text-black">Copy</Button>
			<Button onClick={() => exportedNotesModal.close()} className="text-black">Close</Button>
		</div>
	</div>
</dialog>

<style>
	li {
		list-style-type: disc;
		list-style-position: inside;
		list-style-color: white;
	}
</style>
