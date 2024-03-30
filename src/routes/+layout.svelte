<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { SpaceData_int } from '$lib/types/logs';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { selectedDate } from '$lib/stores/dates';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from 'svelte-french-toast';
	import Footer from '$lib/components/Footer.svelte';
	import { isAuthenticated } from '$lib/stores';
	import Button from '$lib/components/Button.svelte';
	import { createClient, loginWithPopup } from '$lib/services';
	import { authConfig } from '$lib/config';
	import LogitLogo from '$lib/svg/logit-logo.svelte';

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

	const queryClient = new QueryClient();

	const onLogin = async () => {
		const client = await createClient();
		loginWithPopup(client, { domain: authConfig.domain, clientId: authConfig.clientId });
	};
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack" style={'height:100dvh'}>
		<Header space={data.space} spaces={data.spaces} {initialLogNotifications} />
		<main class="flex-1 p-1 flex flex-col overflow-hidden">
			{#if $isAuthenticated}
				<slot />
			{:else}
				<div class="w-full h-full stack center gap-3">
					<div class="hstack center gap-1 text-xl">Welcome to <LogitLogo height="35px" /></div>
					<Button onClick={onLogin}>Login</Button>
				</div>
			{/if}
			<div class="flex justify-end" />
		</main>
		<Footer />
	</div>
</QueryClientProvider>

<Toaster />
