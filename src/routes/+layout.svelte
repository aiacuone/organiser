<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import HeaderFooterLink from '../lib/components/HeaderFooterLink.svelte';
	import type { SpaceData_int } from '$lib/types/general';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';

	export let data: SpaceData_int;
	const { spaces, times, space } = data;

	onMount(() => {
		const goToDefaultSpace = () =>
			goto(`/${spaces[0].replace(' ', '-')}/${getHyphenatedStringFromDate(new Date())}`);
		const isHomePage = $page.url.pathname === '/';
		if (isHomePage) goToDefaultSpace();
	});

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack h-screen">
		<header class="center py-2 bg-gray-200">
			<div class="hstack gap-2 sm:gap-4">
				{#each spaces as space}
					<HeaderFooterLink href="/{space}/{getHyphenatedStringFromDate(new Date())}"
						>{space}</HeaderFooterLink
					>
				{/each}
			</div>
		</header>
		<main class="flex-1 p-2 flex flex-col overflow-hidden">
			<div class="flex justify-end" />
			<slot />
		</main>
		<footer class="py-2 bg-gray-300">
			<div class="hstack center capitalize gap-2 sm:gap-4">
				{#each times as { name, href }}
					{@const timeName = name.replace(' ', '-')}
					<HeaderFooterLink href="/{space}/{href}" isSelected={$page.params.time === timeName}
						>{name}</HeaderFooterLink
					>
				{/each}
			</div>
		</footer>
	</div>
</QueryClientProvider>
