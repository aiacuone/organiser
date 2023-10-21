<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';

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

<CommonLogButton className="flex px-0">
	<button on:click={_onDecrement}>
		<Icon icon={icons.left} height="20px" class="opacity-40" />
	</button>
	<p class="flex-1 px-2 border-l-2 border-r-2 border-gray-200 text-gray-400 min-w-[45px]">
		{value}
	</p>
	<button on:click={_onIncrement}>
		<Icon icon={icons.right} height="20px" class="opacity-40" />
	</button>
</CommonLogButton>
