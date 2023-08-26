<script lang="ts">
	let container;
</script>

<div class="flex-row sm:flex-col gap-2 center w-[30px]" bind:this={container}>
	<slot />
</div>
