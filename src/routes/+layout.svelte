<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { LogType_enum, type SpaceData_int } from '$lib/types/general';
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

	onMount(() => {
		const onKeydown = (e) => {
			switch (true) {
				case e.ctrlKey && e.shiftKey && e.code === 'Space':
					onGotoTodaysDate();
					break;

				case e.key === 'ArrowLeft':
					onClickPreviousDay();
					break;

				case e.key === 'ArrowRight':
					onClickNextDay();
					break;

				case e.key === 'ArrowUp':
					console.log('up');
					break;

				case e.key === 'ArrowDown':
					console.log('down');
					break;

				default:
			}
		};

		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('keydown', onKeydown);
		};
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

	const onGotoTodaysDate = () => {
		$selectedDate = new Date();
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

	const footerButtons = [
		{
			icon: icons.date,
			onClick: () => goto(`/${$page.params.space}`)
		},
		{
			icon: icons.search,
			onClick: () => goto(`/${$page.params.space}/filter`)
		}
	];

	const headerButtons = [
		{
			label: 'todo',
			icon: icons.todo,
			onClick: () => {
				goto(`/${$page.params.space}/filter?type=${LogType_enum.todo}`);
			}
		},
		{
			label: 'question',
			icon: icons.question,
			onClick: () => {
				goto(`/${$page.params.space}/filter?type=${LogType_enum.question}`);
			}
		}
	];
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack" style={'height:100dvh'}>
		<header class="center py-2 px-2 bg-gray-200">
			<div class="flex-1 max-w-screen-lg hstack">
				<div class="flex-1">
					<Button _class="bg-white bg-opacity-80 capitalize" onClick={onOpen}
						>{replaceAllHyphensWithSpaces(data.space)}</Button
					>
				</div>
				<div class="flex-1 hstack justify-end gap-5">
					{#each headerButtons as { icon, onClick }}
						<button on:click={onClick}>
							<Icon {icon} class="text-gray-500" height="20px" />
						</button>
					{/each}
				</div>
			</div>
		</header>
		<main class="flex-1 p-1 sm:p-2 flex flex-col overflow-hidden">
			<div class="flex justify-end" />
			<slot />
		</main>
		<footer class="py-2 bg-gray-300">
			<div class="hstack center capitalize gap-5">
				{#each footerButtons as footerButton}
					<Button _class="bg-white bg-opacity-80" onClick={footerButton.onClick}>
						<Icon icon={footerButton.icon} />
					</Button>
				{/each}
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
