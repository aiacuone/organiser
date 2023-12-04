<script lang="ts">
	import Button from '../Button.svelte';
	import Dialog from './Dialog.svelte';
	import { logEnumNames, Log_enum, type Log_int, LogType_enum } from '$lib/types';
	import { copyToClipboard, downloadAsCSV } from '$lib/utils';

	export let onOpen: () => void;
	export let onClose: () => void;
	export let logs: Log_int[];

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

	const logKeyValueSortFunction = ([keyA], [keyB]) => {
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
			</div>
		</div>

		<div class="stack flex-1 overflow-y-scroll" bind:this={logsContainer}>
			{#each logs.filter((log) => typeFilter[log.type]) as log}
				<div class="stack gap-2 log-stack p-2">
					{#each Object.entries(log)
						.filter(([key, value]) => logKeyValueFilter[key] && value)
						.sort(logKeyValueSortFunction) as [key, value]}
						<p class="capitalize"><b>{logEnumNames[key]}</b>: {value}</p>
					{/each}
				</div>
			{/each}
		</div>
		<div class="hstack center gap-2" bind:clientHeight={footerButtonsContainerHeight}>
			<Button onClick={onCopy} _class="self-center">Copy</Button>
			<Button onClick={onCsv} _class="self-center">CSV</Button>
			<Button onClick={() => dialog.close()} _class="self-center">Close</Button>
		</div>
	</div>
</Dialog>

<style>
	.log-stack:nth-child(odd) {
		background: rgb(246, 246, 246);
	}
</style>
