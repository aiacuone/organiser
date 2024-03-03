<script lang="ts">
	import Button from '../Button.svelte';
	import Dialog from './Dialog.svelte';
	import {
		logEnumNames,
		Log_enum,
		type Log_int,
		LogType_enum,
		LocalStorage_enum,
		logTypeEnumNames
	} from '$lib/types';
	import { copyToClipboard, downloadAsCSV, getLocalStorage, setLocalStorage } from '$lib/utils';
	import { viewport } from '$lib/hooks';
	import type { InfiniteData } from '@sveltestack/svelte-query';
	import type { AxiosResponse } from 'axios';
	import ExportDialogLogs from './ExportDialogLogs.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import { onMount } from 'svelte';

	export let onOpen: () => void;
	export let onClose: () => void;
	export let isLoadingLogs: boolean;
	export let isFetchingLogs: boolean;
	export let isLogsError: boolean;
	export let logsData: InfiniteData<AxiosResponse<any, any>> | undefined = undefined;
	export let logs: Log_int[] | undefined = undefined;
	export let hasNextLogsPage: boolean | undefined = undefined;
	export let getNextLogsPage: (() => void) | undefined = undefined;

	let defaultLogKeyValueFilter: Record<Log_enum, boolean> = {
		id: false,
		date: true,
		title: true,
		reference: true,
		time: false,
		type: true,
		space: false,
		listItems: true,
		checkboxItems: true,
		lastUpdated: false,
		rating: false,
		questions: true
	};

	let logKeyValueFilter: Record<Log_enum, boolean> = { ...defaultLogKeyValueFilter };

	const defaultTypeFilterData: Record<LogType_enum, boolean> = {
		[LogType_enum.time]: true,
		[LogType_enum.important]: true,
		[LogType_enum.todo]: true,
		[LogType_enum.question]: true
	};

	let typeFilter: Record<LogType_enum, boolean> = { ...defaultTypeFilterData };

	onMount(() => {
		const storageLogKeyValueFilter = getLocalStorage(LocalStorage_enum.logKeyValueFilter);
		const storageTypeFilter = getLocalStorage(LocalStorage_enum.typeFilter);

		storageLogKeyValueFilter && (logKeyValueFilter = storageLogKeyValueFilter);
		storageTypeFilter && (typeFilter = storageTypeFilter);
	});

	const logKeyValueSortFunction: (a: [Log_enum, boolean], b: [Log_enum, boolean]) => number = (
		[keyA],
		[keyB]
	) => {
		const keyOrder: Log_enum[] = [
			Log_enum.title,
			Log_enum.reference,
			Log_enum.date,
			Log_enum.type,
			Log_enum.questions,
			Log_enum.listItems,
			Log_enum.checkboxItems,
			Log_enum.rating,
			Log_enum.space,
			Log_enum.time,
			Log_enum.lastUpdated,
			Log_enum.id
		];
		const indexA = keyOrder.indexOf(keyA);
		const indexB = keyOrder.indexOf(keyB);

		return indexA - indexB;
	};

	let logsContainer: HTMLDivElement;
	let containerHeight: number;
	let headerHeight: number;
	let buttonsContainerHeight: number;
	let footerButtonsContainerHeight: number;

	$: containerHeight,
		containerHeight &&
			(logsContainer.style.height = `${
				containerHeight - headerHeight - buttonsContainerHeight - footerButtonsContainerHeight
			}px`);

	const onCopy = () => {
		copyToClipboard(logsContainer.innerText);
	};

	const onCsv = () => {
		downloadAsCSV(logsContainer.innerText);
	};
	let dialog: HTMLDialogElement;

	const onReset = () => {
		const storageLogKeyValueFilter = getLocalStorage(LocalStorage_enum.logKeyValueFilter);
		const storageTypeFilter = getLocalStorage(LocalStorage_enum.typeFilter);

		const resetLogKeyValueFilter = storageLogKeyValueFilter ?? defaultLogKeyValueFilter;

		const resetTypeFilter = storageTypeFilter ?? defaultTypeFilterData;

		typeFilter = { ...resetTypeFilter };
		logKeyValueFilter = { ...resetLogKeyValueFilter };
	};

	const onConfirmSetDefault = () => {
		setLocalStorage(LocalStorage_enum.logKeyValueFilter, { ...logKeyValueFilter });
		setLocalStorage(LocalStorage_enum.typeFilter, { ...typeFilter });

		onCloseDefaultSelection();
	};

	const onUnselectAll = () => {
		const makeAllFalse = (object: Record<string, boolean>) => {
			return Object.entries(object).reduce((acc, [key]) => {
				acc[key] = false;
				return acc;
			}, {} as Record<string, boolean>);
		};
		typeFilter = makeAllFalse({ ...typeFilter });
		logKeyValueFilter = makeAllFalse({ ...logKeyValueFilter });
	};

	const onSelectAll = () => {
		const makeAllTrue = (object: Record<string, boolean>) => {
			return Object.entries(object).reduce((acc, [key]) => {
				acc[key] = true;
				return acc;
			}, {} as Record<string, boolean>);
		};
		typeFilter = makeAllTrue({ ...typeFilter });
		logKeyValueFilter = makeAllTrue({ ...logKeyValueFilter });
	};

	let onOpenDefaultSelection: () => void;
	let onCloseDefaultSelection: () => void;

	const selectButtons = [
		{
			icon: icons.all,
			onClick: onSelectAll
		},
		{
			icon: icons.cross,
			onClick: onUnselectAll
		},
		{
			icon: icons.reset,
			onClick: onReset
		},
		{
			icon: icons.save,
			onClick: () => onOpenDefaultSelection()
		}
	];

	const confirmSaveDefaultButtons = [
		{
			icon: icons.tick,
			onClick: () => onConfirmSetDefault()
		},
		{
			icon: icons.cross,
			onClick: () => onCloseDefaultSelection()
		}
	];

	const footerButtons = [
		{
			onClick: onCopy,
			label: 'Copy'
		},
		{
			onClick: onCsv,
			label: 'CSV'
		},
		{
			onClick: () => dialog.close(),
			label: 'Close'
		}
	];

	let isDefaultSelectionDialogOpen: boolean;
</script>

<Dialog
	bind:dialog
	bind:onOpen
	bind:onClose
	_class="h-full w-full max-w-screen-lg"
	preventClose={isDefaultSelectionDialogOpen}
>
	<div bind:clientHeight={containerHeight} class="stack gap-3 w-full h-full text-sm">
		<header class="text-center" bind:clientHeight={headerHeight}>Export/Copy</header>
		<div class="stack gap-2" bind:clientHeight={buttonsContainerHeight}>
			<div class="flex flex-wrap gap-y-1 gap-x-2 center">
				{#each Object.keys(logKeyValueFilter).filter((key) => {
					return ![Log_enum.id, Log_enum.lastUpdated, Log_enum.rating, Log_enum.space, Log_enum.time].includes(key);
				}) as key}
					<div class="hstack gap-2">
						<label>
							{logEnumNames[key]}
							<input type="checkbox" bind:checked={logKeyValueFilter[key]} />
						</label>
					</div>
				{/each}
			</div>
			<div class="flex flex-wrap gap-y-1 gap-x-2 center">
				{#each Object.entries(typeFilter) as [key]}
					<div class="hstack gap-2">
						<label class="capitalize">
							{logTypeEnumNames[key]}
							<input type="checkbox" bind:checked={typeFilter[key]} />
						</label>
					</div>
				{/each}
			</div>
			<div class="hstack gap-3 center">
				{#each selectButtons as { icon, onClick }}
					<Button {onClick}>
						<Icon {icon} class="text-gray-400" />
					</Button>
				{/each}
			</div>
		</div>

		<div class="stack flex-1 overflow-y-scroll hide-scrollbar" bind:this={logsContainer}>
			{#if isLoadingLogs}
				{#each Array(5) as _}
					<div class="bg-neutral-100 rounded-sm h-[120px] w-full" />
				{/each}
			{:else if isLogsError}
				Error
			{:else if logsData?.pages}
				{#each logsData.pages as page}
					<ExportDialogLogs
						logs={page.data.logs}
						{logKeyValueSortFunction}
						{logKeyValueFilter}
						{typeFilter}
					/>
				{/each}
				<div class="center text-gray-300">
					{#if isFetchingLogs}
						Loading more...
					{:else if hasNextLogsPage}
						<div use:viewport on:enterViewport={getNextLogsPage} class="h-10 w-full" />
					{:else}
						{logsData.pages[0].data.total} Results
					{/if}
				</div>
			{:else if logs}
				<ExportDialogLogs {logs} {logKeyValueSortFunction} {logKeyValueFilter} {typeFilter} />
			{/if}
		</div>
		<div class="hstack center gap-2" bind:clientHeight={footerButtonsContainerHeight}>
			{#each footerButtons as { onClick, label }}
				<Button {onClick}>
					{label}
				</Button>
			{/each}
		</div>
	</div>
</Dialog>

<Dialog
	bind:onOpen={onOpenDefaultSelection}
	bind:onClose={onCloseDefaultSelection}
	bind:isOpen={isDefaultSelectionDialogOpen}
>
	<div class="stack gap-2">
		<p>Are you sure you want to create a new default selection?</p>
		<div class="hstack gap-5 center">
			{#each confirmSaveDefaultButtons as { icon, onClick }}
				<Button {onClick}>
					<Icon {icon} class="text-gray-400" />
				</Button>
			{/each}
		</div>
	</div>
</Dialog>
