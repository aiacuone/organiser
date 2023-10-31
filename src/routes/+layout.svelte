<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { SpaceData_int } from '$lib/types/general';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import {
		getHyphenatedStringFromDate,
		replaceAllHyphensWithSpaces,
		replaceAllSpacesWithHyphens
	} from '$lib/utils/strings';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import { selectedDate, selectedHyphenatedDateString } from '$lib/stores/dates';
	import Input from '$lib/components/Input.svelte';

	export let data: SpaceData_int;
	const { spaces } = data;

	const getDateFromHyphenatedString = (dateString: string) => {
		const [day, month, year] = dateString.split('-').map(Number);

		return new Date(Date.UTC(year, month - 1, day));
	};

	onMount(() => {
		if ($page.params.date) {
			return ($selectedDate = new Date(getDateFromHyphenatedString($page.params.date)));
		}
		$selectedDate = new Date();
	});

	const queryClient = new QueryClient();
	let onOpen: () => void;

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

	export const getNextDay = (date: Date) => {
		const _date = new Date(date);
		_date.setDate(_date.getDate() + 1);
		return _date;
	};
	let isAddingNewSpace: boolean = false;
	let dialog: HTMLDialogElement;
	let addInputValue: string;

	const onDialogClose = () => {
		isAddingNewSpace = false;
		dialog.close();
	};

	const onAddSpace = () => {
		goto(
			`/${replaceAllSpacesWithHyphens(addInputValue)}/date/${getHyphenatedStringFromDate(
				new Date()
			)}`
		);

		addInputValue = '';
		onDialogClose();
		$selectedDate = new Date();
	};
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack" style={'height:100dvh'}>
		<header class="center py-2 bg-gray-200">
			<div class="hstack gap-2 sm:gap-4">
				<Button _class="bg-white bg-opacity-80 capitalize" onClick={onOpen}
					>{replaceAllHyphensWithSpaces(data.space)}</Button
				>
			</div>
		</header>
		<main class="flex-1 p-1 sm:p-2 flex flex-col overflow-hidden">
			<div class="flex justify-end" />
			<slot />
		</main>
		<footer class="py-2 bg-gray-300">
			<div class="hstack center capitalize gap-5">
				<Button _class="bg-white bg-opacity-80 w-[50px] center" onClick={onClickPreviousDay}>
					<Icon icon={icons.left} height="20px" />
				</Button>
				<Button
					_class="bg-white {getHyphenatedStringFromDate(new Date()) ===
					$selectedHyphenatedDateString
						? 'bg-opacity-80'
						: 'bg-opacity-40'}"
					onClick={() => ($selectedDate = new Date())}>Today</Button
				>
				<Button _class="bg-white bg-opacity-80 w-[50px] center" onClick={onClickNextDay}>
					<Icon icon={icons.right} height="20px" />
				</Button>
			</div>
		</footer>
	</div>
</QueryClientProvider>

<Dialog bind:onOpen onClose={onDialogClose} bind:dialog>
	<div class="stack gap-3">
		<div class="stack gap-4 self-center">
			{#each spaces as space}
				{@const onClick = () => {
					goto(
						`/${replaceAllSpacesWithHyphens(space)}/date/${getHyphenatedStringFromDate(new Date())}`
					);
					onDialogClose();
				}}
				<Button {onClick} _class="capitalize">{replaceAllHyphensWithSpaces(space)}</Button>
			{/each}
		</div>
		<div class="min-h-[50px] center">
			{#if isAddingNewSpace}
				<div class="hstack gap-2">
					<Input _class="border border-gray-100 px-2" autofocus bind:value={addInputValue} />
					<button class="bg-gray-50 px-2 py-1" on:click={(e) => onAddSpace(e)}>
						<Icon icon={icons.enter} />
					</button>
				</div>
			{:else}
				<Button onClick={() => (isAddingNewSpace = true)}>Add</Button>
			{/if}
		</div>
	</div>
</Dialog>
