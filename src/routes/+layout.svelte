<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { SpaceData_int } from '$lib/types/logs';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import Button from '$lib/components/Button.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import { selectedDate } from '$lib/stores/dates';
	import Header from '$lib/components/Header.svelte';
	import { searchValue } from '$lib/stores';
	import { Toaster } from 'svelte-french-toast';

	export let data: SpaceData_int;

	const { initialLogNotifications } = data;

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

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft':
					onClickPreviousDay();
					break;

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowRight':
					onClickNextDay();
					break;

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowUp':
					console.log('up');
					break;

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowDown':
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

	const footerButtons = [
		{
			icon: icons.date,
			onClick: () => goto(`/${$page.params.space}`)
		},
		{
			icon: icons.search,
			onClick: () => {
				goto(`/${$page.params.space}/filter`);
				$searchValue = '';
			}
		}
	];
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack" style={'height:100dvh'}>
		<Header space={data.space} spaces={data.spaces} {initialLogNotifications} />
		<main class="flex-1 p-1 flex flex-col overflow-hidden">
			<div class="flex justify-end" />
			<slot />
		</main>
		<footer class="py-2 bg-gray-300 px-3 center">
			<div class="hstack max-w-screen-lg flex-1">
				<div class="hstack center capitalize gap-5">
					{#each footerButtons as footerButton}
						<Button _class="bg-white bg-opacity-80" onClick={footerButton.onClick}>
							<Icon icon={footerButton.icon} />
						</Button>
					{/each}
				</div>
				<div class="flex justify-end flex-1">
					<div class="rounded-full bg-neutral-500 h-[30px] w-[30px] center">
						<p class="text-white">AI</p>
					</div>
				</div>
			</div>
		</footer>
	</div>
</QueryClientProvider>

<Toaster />
