<script lang="ts">
	import { derived } from 'svelte/store';
	import '../app.css';
	import type { SpaceData_int } from '../types/general';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let data: SpaceData_int;
	const { spaces, options } = data;

	const space = derived(page, ($page) =>
		$page.params.space
			? data.spaces.find((space) => space.name === $page.params.space.replace('-', ' '))
			: spaces[0]
	);

	onMount(() => {
		if (!$page.params.time) goto(`/${spaces[0].name.replace(' ', '-')}/today`);
	});
</script>

<div class="stack h-screen">
	<header class="bg-neutral-600 center py-2">
		<div class="hStack gap-4">
			{#each spaces as space}
				{@const spaceName = space.name.replace(' ', '-')}
				<a href="/{spaceName}/today" class="capitalize bg-neutral-500 px-3 rounded-md text-white"
					>{space.name}</a
				>
			{/each}
		</div>
	</header>
	<div class="bg-neutral-100 flex-1">
		<slot />
	</div>
	<footer class="bg-neutral-600 py-2">
		<div class="hStack center capitalize gap-4">
			{#each options as option}
				{@const timeName = option.name.replace(' ', '-')}
				<a
					href="/{$space?.name.replace(' ', '-')}/{timeName}"
					class="capitalize bg-neutral-500 px-3 rounded-md text-white">{option.name}</a
				>
			{/each}
		</div>
	</footer>
</div>
