<script lang="ts">
	import { derived, type Readable } from 'svelte/store';
	import '../app.css';
	import type { SpaceData_int, Space_int } from '../types/general';
	import { page } from '$app/stores';
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import HeaderFooterLink from '../components/HeaderFooterLink.svelte';
	export let data: SpaceData_int;
	const { spaces, times } = data;

	const space: Readable<Space_int | undefined> = derived(page, ($page) =>
		$page.params.space
			? data.spaces.find((space) => space.name === $page.params.space.replace('-', ' '))
			: spaces[0]
	);
	setContext('space', space);

	onMount(() => {
		const goToDefaultSpace = () => goto(`/${spaces[0].name.replace(' ', '-')}/today`);
		const isHomePage = $page.url.pathname === '/';
		if (isHomePage) goToDefaultSpace();
	});
</script>

<div class="stack h-screen">
	<header class="center py-2" style="background:{$space?.color}">
		<div class="hStack gap-2 sm:gap-4">
			{#each spaces as _space}
				{@const spaceName = _space.name.replace(' ', '-')}
				<HeaderFooterLink
					href="/{spaceName}/today"
					isSelected={$space?.name === _space.name}
					style="background:{_space.color}">{_space.name}</HeaderFooterLink
				>
			{/each}
		</div>
	</header>
	<div class="bg-neutral-100 flex-1">
		<slot />
	</div>
	<footer class=" py-2" style="background:{$space?.color}">
		<div class="hStack center capitalize gap-2 sm:gap-4">
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
