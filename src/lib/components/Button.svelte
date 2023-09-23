<script lang="ts">
	export let onClick: () => void = () => {};
	export let isDisabled: boolean = false;
	export let className: string = '';
</script>

<button
	on:click={onClick}
	class="{className} text-sm bg-gray-200 py-[2px] px-3 rounded self-center {isDisabled
		? 'opacity-40'
		: ''} {isDisabled ? 'cursor-not-allowed' : ''}"
	disabled={isDisabled}
>
	<slot />
</button>
