<script lang="ts">
	import { type Time_enum, LogType_enum, type SpaceData_int } from '$lib/types/general';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';

	import { getDate2DaysEarlier, getDayMonthYearFromDate } from '$lib/utils';
	import Button from '$lib/components/Button.svelte';
	import { darkMode } from '$lib/stores';
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import Important from '$lib/components/Logs/Important.svelte';
	import Time from '$lib/components/Logs/Time.svelte';
	import Todo from '$lib/components/Logs/Todo.svelte';
	import Question from '$lib/components/Logs/Question.svelte';
	import NewLog from '$lib/components/NewLog.svelte';
	import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { getDateLogs } from '$lib/api/logsLocalApi';

	interface PageData extends SpaceData_int {
		time: Time_enum;
		date: string;
		space: string;
	}

	export let data: PageData;

	const queryClient = useQueryClient();

	const logs = useQuery('logs', () =>
		getDateLogs({
			space: data.space,
			date: data.date
		})
	);

	$: $page, queryClient.invalidateQueries('logs');

	const getInitialDatePickerValue = () => {
		const { day, month, year } = getDayMonthYearFromDate(getDate2DaysEarlier());
		return `${year}-${month}-${day}`;
	};

	const datePickerValue: Writable<string> = writable(getInitialDatePickerValue());

	$: headerContainer = 0;
	$: parentContainerHeight = 0;
	$: logButtonsContainerHeight = 0;
	$: notesContainerHeight =
		parentContainerHeight - headerContainer - logButtonsContainerHeight - 30;

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

	let notesContainer: HTMLDivElement;
	let newLogType: LogType_enum | undefined;

	const onNoteButtonClick = (logType: LogType_enum) => {
		notesContainer.scrollTo(0, 0);
		newLogType = logType;
	};

	const noteButtons = [
		{
			label: 'log',
			icon: icons.clock,
			onClick: () => onNoteButtonClick(LogType_enum.time)
		},
		{
			label: 'todo',
			icon: icons.todo,
			onClick: () => onNoteButtonClick(LogType_enum.todo)
		},
		{
			label: 'question',
			icon: icons.question,
			onClick: () => onNoteButtonClick(LogType_enum.question)
		},
		{
			label: 'important',
			icon: icons.important,
			onClick: () => onNoteButtonClick(LogType_enum.important)
		}
	];

	const onResetNewLogType = () => {
		newLogType = undefined;
	};

	setContext('onResetNewLogType', onResetNewLogType);
</script>

<div class="flex-1 center stack overflow-hidden" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-4 w-full px-2 max-w-screen-lg h-full sm:h-auto justify-center flex-1 py-3">
		<div class="stack gap-2" bind:clientHeight={logButtonsContainerHeight}>
			<div class="hstack gap-1 sm:gap-2 center flex-wrap">
				<div class="center text-base sm:text-xl hstack gap-1 sm:gap-2">
					<p class="capitalize text-opacity-40">{data.space}</p>
					<p class="text-opacity-40">-</p>
					<p class="capitalize">{data.date}</p>
				</div>
			</div>
			<div class="hstack w-full gap-10">
				{#each noteButtons as { label, icon, onClick }}
					<Button {onClick} className="flex-1 uppercase center hstack gap-2">
						{label}
						<Icon {icon} class="opacity-20" height="20px" />
					</Button>
				{/each}
			</div>
		</div>
		<div
			class="stack gap-6 overflow-y-scroll hide-scrollbar"
			style="max-height:{notesContainerHeight}px"
			bind:this={notesContainer}
		>
			{#if !!newLogType}
				<NewLog type={newLogType} />
			{/if}
			{#if $logs.isLoading}
				<span>Loading...</span>
			{:else if $logs.isError}
				Error
			{:else}
				{#each $logs.data as log}
					{@const { type, ...rest } = log}
					{#if type === LogType_enum.important && log.importance && log.content}
						<Important {...rest} importance={log.importance} content={log.content} />
					{:else if type === LogType_enum.todo && log.priority && log.content}
						<Todo
							{...rest}
							priority={log.priority}
							isChecked={log.isCompleted}
							content={log.content}
						/>
					{:else if type === LogType_enum.question && log.importance && log.content}
						<Question {...rest} importance={log.importance} content={log.content} />
					{:else if type === LogType_enum.time && log.reference && log.bullets && log.time && log.title}
						<Time
							{...rest}
							title={log.title}
							reference={log.reference}
							time={log.time}
							bullets={log.bullets}
						/>
					{/if}
				{/each}
			{/if}
		</div>
		<div bind:clientHeight={headerContainer} class="stack gap-2 flex-1">
			<!-- <div class="hstack center capitalize gap-2 sm:gap-4">
				{#each times as time}
					{@const timeName = time.name.replace(' ', '-')}
					<Button
						onClick={() => goto(`/${space?.name.replace(' ', '-')}/${timeName}`)}
						className="capitalize w-[150px] text-xs sm:text-sm">{time.name}</Button
					>
				{/each}
			</div> -->
			<div class="center hstack gap-3">
				{#if $page.params.time === 'history'}
					<input
						type="date"
						class="border border-gray-300 px-5 py-[1px] rounded text-black"
						bind:value={$datePickerValue}
					/>
				{/if}
			</div>
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
				class="hstack gap-3 justify-end align-center text-xs flex-wrap"
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
			<div class="stack gap-2 sm:gap-4" bind:this={notesModalTextArea} />
		</div>
		<div class="flex flex-wrap gap-4 center" bind:clientHeight={modalButtonContainerHeight}>
			<Button onClick={copy} className="text-black">Copy</Button>
			<Button onClick={() => exportedNotesModal.close()} className="text-black">Close</Button>
		</div>
	</div>
</dialog>
