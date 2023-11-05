<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	export let rating: number;
	export let icon: string;
	export let ratingSize: number | string = 5;
	export let iconSize: string = '30px';
</script>

<div class="relative">
	<Icon {icon} height={iconSize} class="text-gray-200" />
	{#if rating > 2}
		<div class="absolute top-0 left-6">
			<div class="w-[{ratingSize}] h-[{ratingSize}]">
				<Icon icon={icons.highPriority} color="red" height="100%" />
			</div>
		</div>
	{:else if rating < 2}
		<div class="absolute bottom-0 left-6">
			<div class="w-[{ratingSize}] h-[{ratingSize}]">
				<Icon icon={icons.lowPriority} color="green" height="100%" />
			</div>
		</div>
	{/if}
</div>
