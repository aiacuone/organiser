<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import BottomOptions from './BottomOptions.svelte';

	export let isChecked = false;
</script>

<div class="border-dashed border-neutral-200 border px-3 py-4 stack gap-4">
	<div class="hstack gap-4">
		<Icon icon={icons.todo} height="30px" class="opacity-10" />
		<div class="center border-2 border-gray-400 w-[30px] rounded-md">
			{#if isChecked}
				<Icon icon={icons.tick} height="30px" class="opacity-30" />
			{/if}
		</div>
		<p>Ask things to do stuff</p>
	</div>
	<BottomOptions />
</div>
