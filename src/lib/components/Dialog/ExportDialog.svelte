<script lang="ts">
	import Button from '../Button.svelte';
	import Dialog from './Dialog.svelte';
	import { logEnumNames, Log_enum, type Log_int, LogType_enum } from '$lib/types';
	import { copyToClipboard, downloadAsCSV } from '$lib/utils';
	import { viewport } from '$lib/hooks';
	import type { InfiniteData } from '@sveltestack/svelte-query';
	import type { AxiosResponse } from 'axios';
	import ExportDialogLogs from './ExportDialogLogs.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';

	export let onOpen: () => void;
	export let onClose: () => void;
	export let isLoadingLogs: boolean;
	export let isFetchingLogs: boolean;
	export let isLogsError: boolean;
	export let logsData: InfiniteData<AxiosResponse<any, any>> | undefined;
	export let logs: Log_int[] | undefined;
	export let hasNextLogsPage: boolean | undefined = undefined;
	export let getNextLogsPage: (() => void) | undefined = undefined;

	const defaultLogKeyValueFilter: Record<Log_enum, boolean> = {
		title: true,
		reference: true,
		date: true,
		type: true,
		content: true,
		bullets: true,
		question: true,
		answer: true,
		isCompleted: true,
		lastUpdated: false,
		priority: false,
		importance: false,
		space: false,
		time: false,
		id: false
	};

	let logKeyValueFilter: Record<Log_enum, boolean> = { ...defaultLogKeyValueFilter };

	const defaultTypeFilterData: Record<LogType_enum, boolean> = {
		[LogType_enum.time]: true,
		[LogType_enum.important]: true,
		[LogType_enum.todo]: true,
		[LogType_enum.question]: true
	};

	let typeFilter: Record<LogType_enum, boolean> = { ...defaultTypeFilterData };

	const logKeyValueSortFunction: (a: [Log_enum, boolean], b: [Log_enum, boolean]) => number = (
		[keyA],
		[keyB]
	) => {
		const keyOrder = [
			Log_enum.title,
			Log_enum.reference,
			Log_enum.date,
			Log_enum.type,
			Log_enum.content,
			Log_enum.bullets,
			Log_enum.question,
			Log_enum.answer,
			Log_enum.isCompleted,
			Log_enum.priority,
			Log_enum.importance,
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
		typeFilter = { ...defaultTypeFilterData };
		logKeyValueFilter = { ...defaultLogKeyValueFilter };
	};
</script>

<Dialog bind:dialog bind:onOpen bind:onClose _class="h-full w-full max-w-screen-lg">
	<div bind:clientHeight={containerHeight} class="stack gap-3 w-full h-full text-sm">
		<header class="text-center" bind:clientHeight={headerHeight}>Export/Copy</header>
		<div class="stack gap-2" bind:clientHeight={buttonsContainerHeight}>
			<div class="flex flex-wrap gap-y-1 gap-x-2">
				{#each Object.entries(logKeyValueFilter)
					.filter(([key]) => {
						return ![Log_enum.id, Log_enum.lastUpdated, Log_enum.priority, Log_enum.importance, Log_enum.space, Log_enum.time].includes(key);
					})
					.sort(logKeyValueSortFunction) as [key]}
					<div class="hstack gap-2">
						<label>
							{logEnumNames[key]}
							<input type="checkbox" bind:checked={logKeyValueFilter[key]} />
						</label>
					</div>
				{/each}
			</div>
			<div class="flex flex-wrap gap-y-1 gap-x-2">
				{#each Object.entries(typeFilter) as [key]}
					<div class="hstack gap-2">
						<label>
							{key}
							<input type="checkbox" bind:checked={typeFilter[key]} />
						</label>
					</div>
				{/each}
				<Button height="22px" onClick={onReset}>
					<Icon icon={icons.reset} />
				</Button>
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
			<Button onClick={onCopy} _class="self-center">Copy</Button>
			<Button onClick={onCsv} _class="self-center">CSV</Button>
			<Button onClick={() => dialog.close()} _class="self-center">Close</Button>
		</div>
	</div>
</Dialog>
