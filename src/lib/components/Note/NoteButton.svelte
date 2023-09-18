<script lang="ts">
	import type { Space_int } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	export let onClick: () => void = () => {};

	let button;
	const space: Readable<Space_int> = getContext('space');
</script>

<button
	class="rounded-t-md p-1 h-[25px] w-[30px] center"
	on:click={onClick}
	bind:this={button}
	style="background:{$space.color}"
>
	<slot />
</button>
