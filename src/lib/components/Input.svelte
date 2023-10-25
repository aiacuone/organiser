<script lang="ts">
	import { clickOutside } from '$lib/utils/clickAway';
	import { onMount } from 'svelte';

	export let value: string;
	export let placeholder: string | undefined = undefined;
	export let autofocus: boolean = false;
	export let autofillValues: string[] = [];
	export let isDisabled: boolean = false;

	let input: HTMLInputElement;
	let isInputFocused: boolean = false;

	onMount(() => {
		if (autofocus) {
			isInputFocused = true;
		}
	});

	const onClickAutofill = (_value: string) => {
		value = _value;
		isInputFocused = false;
	};

	const onClickOutside = () => {
		isInputFocused = false;
	};
</script>

<div class="relative w-full" use:clickOutside on:click_outside={onClickOutside}>
	<input
		type="text"
		bind:value
		class="placeholder-black placeholder-opacity-30 w-full bg-transparent"
		placeholder={isDisabled ? '' : placeholder}
		bind:this={input}
		on:focus={() => (isInputFocused = true)}
		disabled={isDisabled}
	/>
	<div class="absolute stack top-7">
		{#if isInputFocused}
			{#each autofillValues as autofillValue}
				<button
					class="text-xs text-neutral-400 cursor-pointer hover:bg-gray-100 px-2 py-2 bg-white z-99"
					on:click={() => onClickAutofill(autofillValue)}
				>
					{autofillValue}
				</button>
			{/each}
		{/if}
	</div>
</div>