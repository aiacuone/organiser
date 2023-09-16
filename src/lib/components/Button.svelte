<script lang="ts">
	export let onClick: () => void = () => {};
	export let isDisabled: boolean = false;
</script>

<button
	on:click={onClick}
	class="bg-gray-200 py-1 px-5 rounded self-center {isDisabled ? 'opacity-40' : ''} {isDisabled
		? 'cursor-not-allowed'
		: ''}"
	disabled={isDisabled}
>
	<slot />
</button>
