<script lang="ts">
	import '../app.css'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
	import { selectedDate } from '$lib/stores/dates'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import { isAuthLoading, isAuthenticated } from '$lib/stores'
	import Button from '$lib/components/Button.svelte'
	import { createClient, loginWithRedirect } from '$lib/clientServices'
	import LogitLogo from '$lib/svg/logit-logo.svelte'
	import AddSpace from '$lib/components/AddSpace.svelte'
	import { axios, getHyphenatedStringFromDate, replaceAllSpacesWithHyphens } from '$lib'
	import { goto } from '$app/navigation'

	let { children } = $props()

	const getDateFromHyphenatedString = (dateString: string) => {
		const [day, month, year] = dateString.split('-').map(Number)

		return new Date(Date.UTC(year, month - 1, day))
	}

	let urlSpace = $derived($page.params.space)

	$effect(() => {
		const getSpaces = async () => {
			const spaces = await axios.get('/spaces').then((response) => response.data)
			const areThereAnySpaces = spaces.length > 0
			if (areThereAnySpaces) {
				const date = getHyphenatedStringFromDate(new Date())
				const space = urlSpace || spaces[0]
				goto(`/${replaceAllSpacesWithHyphens(space)}/date/${date}`)
			}
		}

		if ($isAuthenticated) {
			void getSpaces()
		}
	})

	onMount(() => {
		if ($page.params.date) {
			return ($selectedDate = new Date(getDateFromHyphenatedString($page.params.date)))
		}
		$selectedDate = new Date()
	})

	onMount(() => {
		const onKeydown = (e: KeyboardEvent) => {
			switch (true) {
				case e.ctrlKey && e.shiftKey && e.code === 'Space':
					onGotoTodaysDate()
					break

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft':
					onClickPreviousDay()
					break

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowRight':
					onClickNextDay()
					break

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowUp':
					console.log('up')
					break

				case e.ctrlKey && e.shiftKey && e.key === 'ArrowDown':
					console.log('down')
					break

				default:
			}
		}

		document.addEventListener('keydown', onKeydown)

		return () => document.removeEventListener('keydown', onKeydown)
	})

	const onClickPreviousDay = () => {
		const getPreviousDate = (date: Date) => {
			const _date = new Date(date)
			_date.setDate(_date.getDate() - 1)
			return _date
		}
		$selectedDate = getPreviousDate($selectedDate)
	}

	const onClickNextDay = () => {
		const getPreviousDate = (date: Date) => {
			const _date = new Date(date)
			_date.setDate(_date.getDate() + 1)
			return _date
		}
		$selectedDate = getPreviousDate($selectedDate)
	}

	const onGotoTodaysDate = () => {
		$selectedDate = new Date()
	}

	export const getNextDay = (date: Date) => {
		const _date = new Date(date)
		_date.setDate(_date.getDate() + 1)
		return _date
	}

	const queryClient = new QueryClient()

	const onLogin = async () => {
		const client = await createClient()
		loginWithRedirect(client)
	}

	let space = $derived($page.params.space)
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack" style={'height:100dvh'}>
		<Header {space} />
		<main class="flex-1 p-1 flex flex-col overflow-hidden">
			{#if $isAuthLoading}
				<div class="w-full h-full center">Loading...</div>
			{:else if $isAuthenticated && !space}
				<div class="h-full w-full center stack gap-2">
					Add a new space
					<AddSpace />
				</div>
			{:else if $isAuthenticated}
				{@render children()}
			{:else}
				<div class="w-full h-full stack center gap-3">
					<div class="hstack center gap-1 text-xl">Welcome to <LogitLogo height="35px" /></div>
					<Button onclick={onLogin}>Login</Button>
				</div>
			{/if}
			<div class="flex justify-end" />
		</main>
		<Footer />
	</div>
</QueryClientProvider>
