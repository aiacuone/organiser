<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';

	export let time: number;

	const increment = () => {
		time += 0.5;
	};

	const decrement = () => {
		time -= 0.5;
	};
</script>

<CommonLogButton className="flex px-0">
	<button on:click={decrement}>
		<Icon icon={icons.left} height="20px" class="opacity-40" />
	</button>
	<p class="flex-1 px-2 border-l-2 border-r-2 border-gray-200 text-gray-400 min-w-[45px]">{time}</p>
	<button on:click={increment}>
		<Icon icon={icons.right} height="20px" class="opacity-40" />
	</button>
</CommonLogButton>
