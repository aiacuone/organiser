<script lang="ts">
	import { page } from '$app/stores';
	import { derived, type Readable } from 'svelte/store';
	import NewNote from '../../components/Note/New.svelte';
	import { setContext } from 'svelte';
	import type { Space_int } from '../../types/general';

	export let data;

	const space: Readable<Space_int | undefined> = derived(page, ($page) =>
		data.spaces.find((space) => space.name === $page.params.space.replace('-', ' '))
	);
	setContext('space', space);
</script>

<div class="h-full center stack">
	<div class="stack gap-4">
		<div class="center text-xl hStack gap-2">
			<p class="capitalize text-opacity-40 text-black">{$space.name}</p>
			<p class="text-opacity-40 text-black">-</p>
			<p class="capitalize">{data.time}</p>
		</div>
		<NewNote background={$space.color} />
		<div
			class="w-full center rounded-md py-2 sm:p-4 max-w-screen-lg"
			style="background:{$space?.color}"
		>
			<slot />
		</div>
	</div>
</div>
