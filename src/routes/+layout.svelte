<script lang="ts">
	import { derived } from 'svelte/store';
	import '../app.css';
	import type { SpaceData_int } from '../types/general';
	import { page } from '$app/stores';
	export let data: SpaceData_int;
	const { spaces, options } = data;

	const space = derived(page, ($page) =>
		data.spaces.find((space) => space.name === $page.params.space.replace('-', ' '))
	);
</script>

<div class="stack h-screen text-white">
	<header class="bg-neutral-600 center py-2">
		<div class="hStack gap-4">
			{#each spaces as space}
				{@const spaceName = space.name.replace(' ', '-')}
				<a href="/{spaceName}/today" class="capitalize bg-neutral-500 px-3 rounded-md"
					>{space.name}</a
				>
			{/each}
		</div>
	</header>
	<div class="bg-neutral-300 flex-1">
		<slot />
	</div>
	<footer class="bg-neutral-600 py-2">
		<div class="hStack center capitalize gap-4">
			{#each options as time}
				{@const timeName = time.name.replace(' ', '-')}
				<a
					href="/{$space.name.replace(' ', '-')}/{timeName}"
					class="capitalize bg-neutral-500 px-3 rounded-md">{time.name}</a
				>
			{/each}
		</div>
	</footer>
</div>
