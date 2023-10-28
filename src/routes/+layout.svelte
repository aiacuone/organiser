<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import HeaderFooterLink from '../lib/components/HeaderFooterLink.svelte';
	import type { SpaceData_int } from '$lib/types/general';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';

	export let data: SpaceData_int;
	const { spaces, times } = data;

	onMount(() => {
		const goToDefaultSpace = () =>
			goto(`/${spaces[0].replace(' ', '-')}/${getHyphenatedStringFromDate(new Date())}`);
		const isHomePage = $page.url.pathname === '/';
		if (isHomePage) goToDefaultSpace();
	});

	const queryClient = new QueryClient();
	let onOpen: () => void;
	let onClose: () => void;
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
			<div class="hstack center capitalize gap-2 sm:gap-4">
				{#each times as { name, href }}
					{@const timeName = name.replace(' ', '-')}
					<HeaderFooterLink href="/{data.space}/{href}" isSelected={$page.params.time === timeName}
						>{name}</HeaderFooterLink
					>
				{/each}
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
