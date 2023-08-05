<script lang="ts">
	import { derived, type Readable } from 'svelte/store';
	import '../app.css';
	import type { SpaceData_int, Space_int } from '../types/general';
	import { page } from '$app/stores';
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	export let data: SpaceData_int;
	const { spaces, options } = data;

	const space: Readable<Space_int | undefined> = derived(page, ($page) =>
		$page.params.space
			? data.spaces.find((space) => space.name === $page.params.space.replace('-', ' '))
			: spaces[0]
	);
	setContext('space', space);

	onMount(() => {
		const goToDefaultSpace = () => goto(`/${spaces[0].name.replace(' ', '-')}/today`);
		const isHomePage = !$page.params.space;
		if (isHomePage) goToDefaultSpace();
	});
</script>

<div class="stack h-screen">
	<header class="center py-2" style="background:{$space?.color}">
		<div class="hStack gap-4">
			{#each spaces as _space}
				{@const spaceName = _space.name.replace(' ', '-')}
				<a
					href="/{spaceName}/today"
					class={`capitalize bg-neutral-500 px-3 rounded-md  ${
						$space?.name === _space.name ? 'ring ring-opacity-10 ring-black' : 'border-0'
					}`}
					style="background:{_space.color}">{_space.name}</a
				>
			{/each}
		</div>
	</header>
	<div class="bg-neutral-100 flex-1">
		<slot />
	</div>
	<footer class=" py-2" style="background:{$space?.color}">
		<div class="hStack center capitalize gap-4">
			{#each options as option}
				{@const timeName = option.name.replace(' ', '-')}
				<a
					href="/{$space?.name.replace(' ', '-')}/{timeName}"
					class="capitalize bg-neutral-200 px-3 rounded-md {$page.params.time === timeName
						? 'ring ring-black ring-opacity-10'
						: 'ring-0'}">{option.name}</a
				>
			{/each}
		</div>
	</footer>
</div>
