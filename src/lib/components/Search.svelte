<script lang="ts">
	import Icon from '@iconify/svelte';
	import Input from './Input.svelte';
	import { icons } from '$lib/general/icons';

	export let value: string;
	export let onChange: (e: Event) => void = () => {};
	export let onClickClear: () => void = () => {};
	export let onClickEnter: () => void = () => {};
	export let showEnter: boolean = true;
	export let onEnterKeydown: () => void = () => {};
	export let onFocus: (() => void) | undefined = undefined;
</script>

<div class="hstack">
	<div class="hstack center gap-1 px-2 border border-gray-100 rounded-md">
		<Icon icon={icons.search} class="text-gray-500" />
		<Input bind:onFocus _class="outline-none" bind:value {onChange} bind:onEnterKeydown />
	</div>
	{#if showEnter}
		<button class="w-[30px] center" on:click={onClickEnter}>
			<Icon icon={icons.enter} class="text-gray-400" />
		</button>
	{/if}
	<button class="w-[30px] center" on:click={onClickClear}>
		<Icon icon={icons.close} class="text-gray-400" />
	</button>
</div>
