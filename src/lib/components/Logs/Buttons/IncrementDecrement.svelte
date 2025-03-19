<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';

	interface Props {
		value: number;
		min: number;
		max: number;
		onIncrement: () => void;
		onDecrement: () => void;
	}

	let { value, min, max, onIncrement, onDecrement }: Props = $props();

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
		onclick={_onDecrement}
		class="center h-full border-l-2 border-t-2 border-b-2 rounded-l-lg border-gray-100 px-1"
	>
		<Icon icon={icons.left} height="15px" class="text-gray-300" />
	</button>
	<p class="flex-1 min-w-[30px] border-2 border-gray-100 text-gray-400 center text-xs">
		{value}
	</p>
	<button
		onclick={_onIncrement}
		class="center h-full border-r-2 border-t-2 border-b-2 rounded-r-lg border-gray-100 px-1"
	>
		<Icon icon={icons.right} height="15px" class="text-gray-300" />
	</button>
</div>
