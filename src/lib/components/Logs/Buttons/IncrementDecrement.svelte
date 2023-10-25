<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let onIncrement: () => void;
	export let onDecrement: () => void;

	const _onIncrement = () => {
		if (value < max) {
			onIncrement();
		}
	};

	const _onDecrement = () => {
		if (value > min) {
			onDecrement();
		}
	};
</script>

<div class="hstack h-[30px]">
	<button
		on:click={_onDecrement}
		class="center h-full border-l-2 border-t-2 border-b-2 rounded-l-lg border-gray-100 px-[1px]"
	>
		<Icon icon={icons.left} height="15px" class="opacity-40" />
	</button>
	<p class="flex-1 min-w-[30px] border-2 border-gray-100 text-gray-400 center text-xs">
		{value}
	</p>
	<button
		on:click={_onIncrement}
		class="center h-full border-r-2 border-t-2 border-b-2 rounded-r-lg border-gray-100 px-[1px]"
	>
		<Icon icon={icons.right} height="15px" class="opacity-40" />
	</button>
</div>
