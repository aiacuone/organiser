<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import HeaderFooterLink from '../lib/components/HeaderFooterLink.svelte';
	import type { SpaceData_int } from '$lib/types/general';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { derived } from 'svelte/store';

	export let data: SpaceData_int;
	const { spaces, times } = data;

	const space = derived(page, ($page) => spaces.find((space) => space.href === $page.params.space));

	setContext('space', $space);

	onMount(() => {
		const goToDefaultSpace = () => goto(`/${spaces[0].name.replace(' ', '-')}/today`);
		const isHomePage = $page.url.pathname === '/';
		if (isHomePage) goToDefaultSpace();
	});

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack h-screen">
		<header class="center py-2" style="background:{$space?.color}">
			<div class="hstack gap-2 sm:gap-4">
				{#each spaces as { name, href, color }}
					{@const spaceName = name.replace(' ', '-')}
					<HeaderFooterLink
						href="/{spaceName}/today"
						isSelected={$space?.name === href}
						style="background:{color};color:black">{name}</HeaderFooterLink
					>
				{/each}
			</div>
		</header>
		<main class="flex-1 p-2 flex flex-col overflow-hidden">
			<div class="flex justify-end" />
			<slot />
		</main>
		<footer class=" py-2" style="background:{$space?.color}">
			<div class="hstack center capitalize gap-2 sm:gap-4">
				{#each times as time}
					{@const timeName = time.name.replace(' ', '-')}
					<HeaderFooterLink
						href="/{$space?.name.replace(' ', '-')}/{timeName}"
						isSelected={$page.params.time === timeName}>{time.name}</HeaderFooterLink
					>
				{/each}
			</div>
		</footer>
	</div>
</QueryClientProvider>
