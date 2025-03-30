<script lang="ts">
	import { icons } from '$lib/general/icons'
	import Icon from '@iconify/svelte'

	interface Props {
		rating: number
		icon: string
		ratingSize: number | string
		iconSize: string
	}

	const { rating, icon, ratingSize = 5, iconSize = '30px' }: Props = $props()
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
