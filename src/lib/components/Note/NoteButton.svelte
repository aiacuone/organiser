<script lang="ts">
	import { getContext } from 'svelte';

	export let onClick: () => void = () => {};

	let button;
	const spaceColor = getContext('spaceColor');
</script>

<button
	class="rounded-md p-1 h-[30px] w-[35px] center"
	on:click={onClick}
	bind:this={button}
	style="background:{spaceColor}"
>
	<slot />
</button>
