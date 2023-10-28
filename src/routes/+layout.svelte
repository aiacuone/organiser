<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { SpaceData_int } from '$lib/types/general';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';

	export let data: SpaceData_int;
	const { spaces } = data;

	onMount(() => {
		const goToDefaultSpace = () =>
			goto(`/${spaces[0].replace(' ', '-')}/${getHyphenatedStringFromDate(new Date())}`);
		const isHomePage = $page.url.pathname === '/';
		if (isHomePage) goToDefaultSpace();
	});

	const queryClient = new QueryClient();
	let onOpen: () => void;
	let onClose: () => void;

	export const getDateFromHyphenatedString = (dateString: string) => {
		const [day, month, year] = dateString.split('-').map(Number);

		return new Date(Date.UTC(year, month - 1, day));
	};

	export const getDayFromNumber = (day: number) => {
		switch (day) {
			case 0:
				return 'Sunday';
			case 1:
				return 'Monday';
			case 2:
				return 'Tuesday';
			case 3:
				return 'Wednesday';
			case 4:
				return 'Thursday';
			case 5:
				return 'Friday';
			case 6:
				return 'Saturday';
		}
	};

	export const getDayMonthYearFromDate = (date: Date) => {
		const _date = new Date(date);
		const day = _date.getDate();
		const month = _date.getMonth() + 1;
		const year = _date.getFullYear();
		const hour = _date.getHours();
		const minutes = _date.getMinutes();

		return {
			day,
			month,
			year,
			string: `${day}-${month}-${year}`,
			dayString: getDayFromNumber(_date.getDay()),
			hour,
			minutes
		};
	};

	const onClickPreviousDay = () => {
		const getPreviousDay = (date: Date) => {
			const _date = new Date(date);
			_date.setDate(_date.getDate() - 1);
			return _date;
		};
		const selectedDate = getDateFromHyphenatedString($page.params.date);
		goto(`/${data.space}/${getHyphenatedStringFromDate(getPreviousDay(selectedDate))}`);
	};
	const onClickNextDay = () => {
		const getPreviousDay = (date: Date) => {
			const _date = new Date(date);
			_date.setDate(_date.getDate() + 1);
			return _date;
		};
		const selectedDate = getDateFromHyphenatedString($page.params.date);
		goto(`/${data.space}/${getHyphenatedStringFromDate(getPreviousDay(selectedDate))}`);
	};

	export const getNextDay = (date: Date) => {
		const _date = new Date(date);
		_date.setDate(_date.getDate() + 1);
		return _date;
	};

	const getDateString = (date: Date) => {
		const { string } = getDayMonthYearFromDate(date);
		return string;
	};
	const todaysDate = new Date();
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack" style={'height:100dvh'}>
		<header class="center py-2 bg-gray-200">
			<div class="hstack gap-2 sm:gap-4">
				<Button _class="bg-white bg-opacity-80 capitalize" onClick={onOpen}>{data.space}</Button>
			</div>
		</header>
		<main class="flex-1 p-1 sm:p-2 flex flex-col overflow-hidden">
			<div class="flex justify-end" />
			<slot />
		</main>
		<footer class="py-2 bg-gray-300">
			<div class="hstack center capitalize gap-2 sm:gap-3">
				<Button _class="bg-white bg-opacity-80" onClick={onClickPreviousDay}>
					<Icon icon={icons.left} />
				</Button>
				<Button
					_class="bg-white bg-opacity-80"
					onClick={() => goto(`/${data.space}/${getDateString(todaysDate)}`)}>Today</Button
				>
				<Button _class="bg-white bg-opacity-80" onClick={onClickNextDay}>
					<Icon icon={icons.right} />
				</Button>
			</div>
		</footer>
	</div>
</QueryClientProvider>

<Dialog bind:onOpen bind:onClose>
	<div class="stack gap-4">
		{#each spaces as space}
			{@const onClick = () => {
				goto(`/${space.replace(' ', '-')}/${getHyphenatedStringFromDate(new Date())}`);
				onClose();
			}}
			<Button {onClick} _class="capitalize">{space}</Button>
		{/each}
	</div>
</Dialog>
