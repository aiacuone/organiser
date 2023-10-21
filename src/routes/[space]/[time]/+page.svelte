<script lang="ts">
	import type { Time_enum, SpaceData_int, Space_int } from '$lib/types/general';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';

	import { getDate2DaysEarlier, getDayMonthYearFromDate } from '$lib/utils';
	import Button from '$lib/components/Button.svelte';
	import { darkMode } from '$lib/stores';
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import Important from '$lib/components/Logs/Important.svelte';
	import Log from '$lib/components/Logs/Log.svelte';
	import Todo from '$lib/components/Logs/Todo.svelte';
	import Question from '$lib/components/Logs/Question.svelte';
	import { goto } from '$app/navigation';

	interface PageData extends SpaceData_int {
		time: Time_enum;
	}

	export let data: PageData;
	const { times } = data;

	const space = getContext('space') as Space_int;

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

	const noteButtons = [
		{
			label: 'log',
			icon: icons.clock,
			onClick: () => {}
		},
		{
			label: 'todo',
			icon: icons.todo,
			onClick: () => {}
		},
		{
			label: 'question',
			icon: icons.question,
			onClick: () => {}
		},
		{
			label: 'important',
			icon: icons.important,
			onClick: () => {}
		}
	];
</script>

<div class="flex-1 center stack overflow-hidden" bind:clientHeight={parentContainerHeight}>
	<div class="stack gap-4 w-full px-2 max-w-screen-lg h-full sm:h-auto justify-center flex-1 py-3">
		<div bind:clientHeight={headerContainer} class="stack gap-2 flex-1">
			<div class="hstack gap-1 sm:gap-2 center flex-wrap">
				<div class="center text-base sm:text-xl hstack gap-1 sm:gap-2">
					<p class="capitalize text-opacity-40">{space?.name}</p>
					<p class="text-opacity-40">-</p>
					<p class="capitalize">{data.time}</p>
				</div>
			</div>
			<div class="hstack center capitalize gap-2 sm:gap-4">
				{#each times as time}
					{@const timeName = time.name.replace(' ', '-')}
					<Button
						onClick={() => goto(`/${space?.name.replace(' ', '-')}/${timeName}`)}
						className="capitalize w-[150px] text-xs sm:text-sm">{time.name}</Button
					>
				{/each}
			</div>
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
		<div
			class="stack gap-6 overflow-y-scroll hide-scrollbar"
			style="max-height:{notesContainerHeight}px"
		>
			<Log isEditing />
			<Todo />
			<Important />
			<Log />
			<Question />
		</div>
		<div class="center gap-10 pb-1" bind:clientHeight={logButtonsContainerHeight}>
			{#each noteButtons as { label, icon, onClick }}
				<Button {onClick} className="flex-1 uppercase center hstack gap-2">
					{label}
					<Icon {icon} class="opacity-20" height="20px" />
				</Button>
			{/each}
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
