<script lang="ts">
	export let onClick: () => void = () => {};
</script>

<button on:click={onClick} class="bg-gray-200 py-1 px-5 rounded">
	<slot />
</button>
