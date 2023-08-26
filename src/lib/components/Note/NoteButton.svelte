<script lang="ts">
	export let onClick: () => void = () => {};

	let button;
</script>

<button
	class="bg-white bg-opacity-40 rounded-md p-1 h-[25px] w-[30px] center"
	on:click={onClick}
	bind:this={button}
>
	<slot />
</button>
