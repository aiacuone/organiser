<script lang="ts">
	import Icon from '@iconify/svelte';
	import Input from './Input.svelte';
	import { icons } from '$lib/general/icons';
	import Button from './Button.svelte';

	interface Props {
		value?: string;
		onchange?: (e: Event) => void;
		onClickClear?: () => void;
		onClickEnter?: () => void;
		showEnter?: boolean;
		onEnterKeydown?: () => void;
		onFocus?: (() => void) | undefined;
	}

	let { value, onClickClear, onClickEnter, showEnter, onEnterKeydown, onchange }: Props = $props();
</script>

<div class="hstack">
	<div class="hstack center gap-1 px-2 border border-gray-100 rounded-md">
		<Icon icon={icons.search} class="text-gray-500" />
		<Input _class="outline-none" bind:value onChange={onchange} bind:onEnterKeydown />
	</div>
	{#if showEnter}
		<button class="w-[30px] center" onclick={onClickEnter}>
			<Icon icon={icons.enter} class="text-gray-400" />
		</button>
	{/if}
</div>
<Button _class="w-[60px] center" onClick={onClickClear}>
	<Icon icon={icons.reset} class="text-gray-400" />
</Button>
