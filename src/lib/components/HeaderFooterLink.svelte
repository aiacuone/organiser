<script lang="ts">
	import { darkMode } from '$lib/stores';
	export let href: string;
	export let isSelected: boolean = false;
	export let style = '';
</script>

<a
	{href}
	style="{$darkMode.boolean ? $darkMode.darkStyles.string : $darkMode.lightStyles.string};{style}"
	class="capitalize px-2 py-1 sm:px-3 rounded-md {isSelected
		? 'ring-[2px] ring-black ring-opacity-20'
		: 'ring-0'} text-xs sm:text-sm whitespace-nowrap"><slot /></a
>
