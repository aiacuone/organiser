<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Icon from '@iconify/svelte';
	import NewLog from '$lib/components/NewLog.svelte';
	import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { goto } from '$app/navigation';
	import Search from '$lib/components/Search.svelte';
	import PillButton from '$lib/components/Logs/Buttons/PillButton.svelte';
	import ExportDialog from '$lib/components/Dialog/ExportDialog.svelte';
	import { browser } from '$app/environment';
	import {
		getLogsClient,
		getTitlesAndReferencesClient,
		LogType_enum,
		replaceAllSpacesWithHyphens,
		selectedDate,
		selectedHyphenatedDateString,
		titlesAndReferences,
		type Log_int,
		icons,
		getDateFromHyphenatedString,
		selectedDayString,
		type SpaceData_int,
		whichInputIsFocused,
		getCapitalizedWords,
		darkMode,
		getHyphenatedStringFromDate,
		getDayFromHyphenatedString,
		useDisclosure
	} from '$lib';
	import Log from '$lib/components/Logs/Log.svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	interface Props extends SpaceData_int {
		data: {
			date: string;
			space: string;
			titles: string[];
			references: string[];
		};
	}

	const { data }: Props = $props();

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
			getLogsClient({
				space: replaceAllSpacesWithHyphens(data.space),
				date: $selectedDate
			}),
		{
			onSuccess: () =>
				browser &&
				goto(`/${replaceAllSpacesWithHyphens(data.space)}/date/${$selectedHyphenatedDateString}`)
		}
	);

	const titlesAndReferencesQuery = useQuery('titlesAndReferences', () =>
		getTitlesAndReferencesClient(replaceAllSpacesWithHyphens(data.space))
	);

	const invalidateLogsAndTitlesAndReferences = async () => {
		queryClient.invalidateQueries('logs');
		queryClient.invalidateQueries('titlesAndReferences');
	};

	$effect(() => {
		$selectedDate && debounce(invalidateLogsAndTitlesAndReferences);
	});

	$effect(() => {
		$page.params.space && invalidateLogsAndTitlesAndReferences();
	});

	$effect(() => {
		$titlesAndReferencesQuery && ($titlesAndReferences = $titlesAndReferencesQuery.data);
	});

	let headerContainer = $state(0);
	let parentContainerHeight = $state(0);
	let logButtonsContainerHeight = $state(0);
	const notesContainerHeight = $derived(
		parentContainerHeight - headerContainer - logButtonsContainerHeight - 55
	);

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

	let showInNotesModalCheckboxes: Record<string, boolean> = $state({ ...defaultModalCheckboxes });

	const resetCheckboxes = () => (showInNotesModalCheckboxes = { ...defaultModalCheckboxes });

	let notesModalTextArea: HTMLDivElement;
	const copy = () => {
		const clipboardItem = new ClipboardItem({
			'text/plain': new Blob([notesModalTextArea.innerText.trim()], { type: 'text/plain' })
		});
		navigator.clipboard.write([clipboardItem]);
	};

	let modalContainerHeight = $state(0);
	let modalCheckboxContainerHeight = $state(0);
	let modalButtonContainerHeight = $state(0);
	let modalMainContentHeight = $derived(
		modalContainerHeight - modalCheckboxContainerHeight - modalButtonContainerHeight - 20
	);

	let notesContainer: HTMLDivElement | undefined = $state();
	let newLogType: LogType_enum | undefined = $state();
	let isThereANewLog = $derived(!!newLogType);

	const onNoteButtonClick = (logType: LogType_enum) => {
		notesContainer?.scrollTo(0, 0);
		newLogType = logType;
	};

	let filters: LogType_enum[] = $state([]);

	const filteredLogs = $derived(
		filters.length === 0
			? $logs.data?.logs
			: $logs.data?.logs.filter((log: Log_int) => filters.includes(log.type))
	);

	const noteButtons: Record<LogType_enum, { label: string; icon: string; type: LogType_enum }> = {
		[LogType_enum.time]: {
			label: 'log',
			icon: icons.clock,
			type: LogType_enum.time
		},
		[LogType_enum.todo]: {
			label: 'todo',
			icon: icons.todo,
			type: LogType_enum.todo
		},
		[LogType_enum.important]: {
			label: 'important',
			icon: icons.important,
			type: LogType_enum.important
		},
		[LogType_enum.question]: {
			label: 'question',
			icon: icons.question,
			type: LogType_enum.question
		},
		[LogType_enum.list]: {
			label: 'list',
			icon: icons.list,
			type: LogType_enum.list
		}
	};

	const onResetNewLogType = () => (newLogType = undefined);

	setContext('onResetNewLogType', onResetNewLogType);

	const onDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const target = event.target as HTMLInputElement;
		$selectedDate = getDateFromHyphenatedString(target.value.split('-').reverse().join('-'));
	};

	let searchValue: string = $state('');

	const onSearch = () => {
		goto(`/${$page.params.space}/filter?search=${searchValue}`);
	};

	onMount(() => {
		const keydown = (e: KeyboardEvent) => {
			if (e.shiftKey && e.ctrlKey && e.key === 'S') {
				e.preventDefault();
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
		filters = [];
	};

	const onClickClear = () => (filters = []);

	const {
		isOpen: isExportDialogOpen,
		onOpen: openExportDialog,
		onClose: onCloseExportDialog
	} = useDisclosure();

	const onSearchChange = (e: Event) => (searchValue = (e.target as HTMLTextAreaElement).value);
</script>

<div class="flex-1 center stack overflow-hidden" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-4 w-full px-2 max-w-screen-lg h-full justify-center flex-1 py-1">
		<div class="stack gap-2 center" bind:clientHeight={logButtonsContainerHeight}>
			<div class="hstack center gap-2 flex-wrap">
				<div class="hstack gap-2 center">
					<div class="center hstack gap-1 flex-wrap">
						<p>
							{$selectedDayString?.sliced ?? getDayFromHyphenatedString(data.date)?.slice(0, 3)}
						</p>
						<p class="capitalize">{$selectedHyphenatedDateString ?? data.date}</p>
					</div>
					<input type="date" onchange={onDateChange} class="w-[20px]" />
				</div>
				<Search
					value={searchValue}
					onClickEnter={onSearch}
					onEnterKeydown={onSearch}
					{onClickClear}
					onchange={onSearchChange}
				/>
				<Button onclick={openExportDialog}>
					<Icon icon={icons.export} height="20px" class="text-gray-400" />
				</Button>
			</div>

			<div class="flex flex-wrap center w-full gap-y-3 gap-x-3 min-w-[300px]">
				{#each Object.values(noteButtons) as { icon, type }}
					<PillButton
						_class="w-[90px]"
						buttons={[
							{
								onclick: () => onNoteButtonClick(type),
								icon,
								_class: 'w-4/6'
							},
							{
								onclick: () =>
									filters.includes(type)
										? (filters = filters.filter((filter) => filter !== type))
										: (filters = [...filters, type]),
								_class: `w-2/6 ${filters.includes(type) ? 'bg-neutral-100' : 'bg-white'}`
							}
						]}
					/>
				{/each}
			</div>
		</div>
		<div
			class="stack gap-6 hide-scrollbar flex-1 {!!$whichInputIsFocused
				? 'overflow-y-hidden'
				: 'overflow-y-scroll'}"
			style="max-height:{notesContainerHeight}px"
			bind:this={notesContainer}
		>
			{#if isThereANewLog}
				<NewLog type={newLogType} />
			{/if}
			{#if $logs.isLoading}
				<div style="max-height:{notesContainerHeight}px" class="stack gap-6">
					{#each Array(5) as _}
						<div class="bg-neutral-100 rounded-sm h-[120px] w-full"></div>
					{/each}
				</div>
			{:else if $logs.isError}
				Error
			{:else if filteredLogs}
				{#each filteredLogs as log}
					<Log initialLog={log} />
				{/each}
			{/if}
		</div>
		<div class="stack gap-2">
			<div class="hstack center capitalize gap-5">
				<Button _class="bg-white bg-opacity-80 w-[50px] center" onclick={onClickPreviousDay}>
					<Icon icon={icons.left} height="20px" class="text-gray-400" />
				</Button>
				<Button
					_class="bg-white {getHyphenatedStringFromDate(new Date()) ===
					$selectedHyphenatedDateString
						? 'bg-opacity-80'
						: 'bg-opacity-40'}"
					onclick={onGotoTodaysDate}
					><div class=" rounded-md border-2 w-[18px] h-[18px] border-gray-400"></div></Button
				>
				<Button _class="bg-white bg-opacity-80 w-[50px] center" onclick={onClickNextDay}>
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
			<Button className="text-black text-xs self-end" onclick={resetCheckboxes}>Reset</Button>
		</div>
		<div
			class="stack gap-10 center h-full overflow-y-scroll hide-scrollbar"
			style="height:{modalMainContentHeight}px"
		>
			<div class="stack gap-2 sm:gap-4" bind:this={notesModalTextArea}></div>
		</div>
		<div class="flex flex-wrap gap-4 center" bind:clientHeight={modalButtonContainerHeight}>
			<Button onclick={copy} className="text-black">Copy</Button>
			<Button onclick={() => exportedNotesModal.close()} className="text-black">Close</Button>
		</div>
	</div>
</dialog>

<svelte:head>
	<title>{getCapitalizedWords(data.space)} - Organiser</title>
</svelte:head>

{#if filteredLogs && filteredLogs.length}
	<ExportDialog
		isOpen={$isExportDialogOpen}
		onClose={onCloseExportDialog}
		onOpen={openExportDialog}
		logs={filteredLogs}
		isLoadingLogs={$logs.isLoading}
		isLogsError={$logs.isError}
		isFetchingLogs={$logs.isFetching}
	/>
{/if}
