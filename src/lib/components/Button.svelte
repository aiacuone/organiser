<script lang="ts">
	export let onClick: (e: any) => void = () => {};
	export let isDisabled: boolean = false;
	export let className: string = '';
	export let _class: string = '';
	export let height = '28px';
</script>

<button
	on:click={onClick}
	class=" text-sm shadow-md px-3 rounded {className} {_class} {isDisabled
		? 'opacity-40'
		: ''} {isDisabled ? 'cursor-not-allowed' : ''}"
	disabled={isDisabled}
	style={`height:${height}`}
>
	<slot />
</button>
