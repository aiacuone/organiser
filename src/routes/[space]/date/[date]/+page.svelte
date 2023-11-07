<script lang="ts">
	import {
		Time_enum,
		LogType_enum,
		type SpaceData_int,
		type LogBase_int,
		type Log_int
	} from '$lib/types/general';
	import { onMount, setContext } from 'svelte';
	import { page } from '$app/stores';
	import { getDateFromHyphenatedString, getDayFromHyphenatedString } from '$lib/utils';
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
	import { getLogs, getTitlesAndReferences } from '$lib/api/logsLocalApi';
	import { goto } from '$app/navigation';
	import { titlesAndReferences } from '$lib/stores';
	import { selectedDate, selectedDayString, selectedHyphenatedDateString } from '$lib/stores/dates';
	import {
		getCapitalizedWords,
		getHyphenatedStringFromDate,
		replaceAllSpacesWithHyphens
	} from '$lib/utils/strings';
	import Search from '$lib/components/Search.svelte';
	import { derived, writable, type Writable } from 'svelte/store';

	interface PageData extends SpaceData_int {
		time: Time_enum;
		date: string;
		space: string;
		titles: string[];
		references: string[];
	}

	export let data: PageData;

	const queryClient = useQueryClient();

	let timer: any;
	const debounce = (fn: () => any, delay = 500) => {
		const timeout = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn();
			}, delay);
		};
		timeout();
	};

	const logs = useQuery(
		'logs',
		() =>
			$selectedHyphenatedDateString &&
			getLogs({
				space: replaceAllSpacesWithHyphens(data.space),
				date: $selectedDate
			}),
		{
			onSuccess: () => {
				goto(`/${replaceAllSpacesWithHyphens(data.space)}/date/${$selectedHyphenatedDateString}`);
			}
		}
	);

	const titlesAndReferencesQuery = useQuery('titlesAndReferences', () =>
		getTitlesAndReferences(replaceAllSpacesWithHyphens(data.space))
	);

	const invalidateLogsAndTitlesAndReferences = () => {
		queryClient.invalidateQueries('logs');
		queryClient.invalidateQueries('titlesAndReferences');
	};

	$: $selectedDate, debounce(invalidateLogsAndTitlesAndReferences);
	$: $page.params.space, invalidateLogsAndTitlesAndReferences();
	$: $titlesAndReferencesQuery, ($titlesAndReferences = $titlesAndReferencesQuery.data);

	$: headerContainer = 0;
	$: parentContainerHeight = 0;
	$: logButtonsContainerHeight = 0;
	$: notesContainerHeight =
		parentContainerHeight - headerContainer - logButtonsContainerHeight - 55;

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

	const filters: Writable<Array<LogType_enum>> = writable([]);

	const filteredLogs = derived([logs, filters], ([$logs, $filters]) => {
		if ($filters.length === 0) return $logs.data;
		return $logs.data?.filter((log: Log_int) => $filters.includes(log.type));
	});

	const noteButtons = [
		{
			label: 'log',
			icon: icons.clock,
			type: LogType_enum.time
		},
		{
			label: 'todo',
			icon: icons.todo,
			type: LogType_enum.todo
		},
		{
			label: 'important',
			icon: icons.important,
			type: LogType_enum.important
		},
		{
			label: 'question',
			icon: icons.question,
			type: LogType_enum.question
		}
	];

	const onResetNewLogType = () => {
		newLogType = undefined;
	};

	setContext('onResetNewLogType', onResetNewLogType);

	const onDateChange = (e) => {
		$selectedDate = getDateFromHyphenatedString(e.target.value.split('-').reverse().join('-'));
	};

	let searchValue: string;
	let onSearchFocus: () => void;

	const onSearch = () => {
		goto(`/${$page.params.space}/filter?search=${searchValue}`);
	};

	onMount(() => {
		const keydown = (e: KeyboardEvent) => {
			if (e.shiftKey && e.ctrlKey && e.key === 'S') {
				e.preventDefault();
				onSearchFocus();
			}
		};
		document.addEventListener('keydown', keydown);
		return () => {
			document.removeEventListener('keydown', keydown);
		};
	});

	const onClickPreviousDay = () => {
		const getPreviousDate = (date: Date) => {
			const _date = new Date(date);
			_date.setDate(_date.getDate() - 1);
			return _date;
		};
		$selectedDate = getPreviousDate($selectedDate);
	};

	const onClickNextDay = () => {
		const getPreviousDate = (date: Date) => {
			const _date = new Date(date);
			_date.setDate(_date.getDate() + 1);
			return _date;
		};
		$selectedDate = getPreviousDate($selectedDate);
	};

	const onGotoTodaysDate = () => {
		$selectedDate = new Date();
	};

	const onClickClear = () => {
		$filters = [];
	};
</script>

<div class="flex-1 center stack overflow-hidden" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-4 w-full px-2 max-w-screen-lg h-full justify-center flex-1 py-1">
		<div class="stack gap-2 center" bind:clientHeight={logButtonsContainerHeight}>
			<div class="hstack center gap-2 flex-wrap">
				<div class="hstack gap-2 center">
					<div class="center hstack gap-1 flex-wrap">
						<p class="capitalize text-opacity-40">{data.space}</p>
						<p>-</p>
						<p>
							{$selectedDayString?.sliced ?? getDayFromHyphenatedString(data.date)?.slice(0, 3)}
						</p>
						<p class="capitalize">{$selectedHyphenatedDateString ?? data.date}</p>
					</div>
					<input type="date" on:change={onDateChange} class="w-[20px]" />
				</div>
				<Search
					bind:onFocus={onSearchFocus}
					bind:value={searchValue}
					onClickEnter={onSearch}
					onEnterKeydown={onSearch}
					{onClickClear}
				/>
			</div>

			<div class="grid grid-cols-4 w-full gap-y-3 gap-x-3 max-w-[500px] min-w-[300px]">
				{#each noteButtons as { icon, type }}
					<div class="flex-1 hstack shadow-md min-h-[30px] rounded-r-md rounded-l-md">
						<button
							class=" w-4/6 h-full center rounded-l-md"
							on:click={() => onNoteButtonClick(type)}
						>
							<Icon {icon} class="text-gray-300" height="20px" />
						</button>
						<button
							class="rounded-r-md w-2/6 h-full border-l-[2px] border-gray-50 {$filters.includes(
								type
							)
								? 'bg-gray-50'
								: 'bg-white'}"
							on:click={() =>
								$filters.includes(type)
									? ($filters = $filters.filter((filter) => filter !== type))
									: ($filters = [...$filters, type])}
						/>
					</div>
				{/each}
			</div>
		</div>
		<div
			class="stack gap-6 overflow-y-scroll hide-scrollbar flex-1"
			style="max-height:{notesContainerHeight}px"
			bind:this={notesContainer}
		>
			{#if !!newLogType}
				<NewLog type={newLogType} />
			{/if}
			{#if $logs.isLoading}
				<div style="max-height:{notesContainerHeight}px" class="stack gap-6">
					{#each Array(5) as _}
						<div class="bg-neutral-100 rounded-sm h-[120px] w-full" />
					{/each}
				</div>
			{:else if $logs.isError}
				Error
			{:else if $filteredLogs}
				{#each $filteredLogs as log}
					{@const { type, ...rest } = log}
					{#if type === LogType_enum.important && log.importance && log.content}
						<Important {...rest} importance={log.importance} content={log.content} />
					{:else if type === LogType_enum.todo && log.priority && log.content}
						<Todo
							{...rest}
							priority={log.priority}
							isCompleted={log.isCompleted}
							content={log.content}
						/>
					{:else if type === LogType_enum.question && log.importance && log.question}
						<Question {...rest} importance={log.importance} content={log.content} />
					{:else if type === LogType_enum.time && log.title}
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
		<div class="stack gap-2">
			<div class="hstack center capitalize gap-5">
				<Button _class="bg-white bg-opacity-80 w-[50px] center" onClick={onClickPreviousDay}>
					<Icon icon={icons.left} height="20px" class="text-gray-400" />
				</Button>
				<Button
					_class="bg-white {getHyphenatedStringFromDate(new Date()) ===
					$selectedHyphenatedDateString
						? 'bg-opacity-80'
						: 'bg-opacity-40'}"
					onClick={onGotoTodaysDate}
					><div class=" rounded-md border-2 w-[18px] h-[18px] border-gray-400" /></Button
				>
				<Button _class="bg-white bg-opacity-80 w-[50px] center" onClick={onClickNextDay}>
					<Icon icon={icons.right} height="20px" class="text-gray-400" />
				</Button>
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

<svelte:head>
	<title>{getCapitalizedWords(data.space)} - Organiser</title>
</svelte:head>
