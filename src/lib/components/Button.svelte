<script lang="ts">
	export let onClick: (e: any) => void = () => {};
	export let isDisabled: boolean = false;
	export let className: string = '';
	export let _class: string = '';
</script>

<button
	on:click={onClick}
	class=" text-sm shadow-md h-[28px] px-3 min-w-[60px] rounded {className} {_class} {isDisabled
		? 'opacity-40'
		: ''} {isDisabled ? 'cursor-not-allowed' : ''}"
	disabled={isDisabled}
>
	<slot />
</button>
