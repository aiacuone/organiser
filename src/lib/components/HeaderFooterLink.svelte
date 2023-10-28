<script lang="ts">
	export let href: string;
	export let isSelected: boolean = false;
	export let onClick: (() => void) | undefined = undefined;
</script>

<a
	on:click={onClick}
	{href}
	class="capitalize px-2 py-1 sm:px-3 rounded-md {isSelected
		? 'ring-[2px] ring-black ring-opacity-20'
		: 'ring-0'} text-sm whitespace-nowrap bg-gray-100"><slot /></a
>
