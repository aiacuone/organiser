<script lang="ts">
	export let href: string;
	export let isSelected: boolean = false;
	export let style = '';
</script>

<a
	{href}
	class="capitalize bg-white px-2 py-1 sm:px-3 rounded-md {isSelected
		? 'ring ring-black ring-opacity-10'
		: 'ring-0'} text-xs sm:text-sm whitespace-nowrap"
	{style}><slot /></a
>
