<script lang="ts">
	import { clickOutside } from '$lib/utils/clickAway';
	import { onMount } from 'svelte';

	export let value: string = '';
	export let placeholder: string | undefined = undefined;
	export let autofocus: boolean = false;
	export let autofillValues: (string | undefined)[] = [];
	export let isDisabled: boolean = false;
	export const changeInputValue = (_value: string | undefined) => {
		if (!_value) return;
		value = _value;
	};
	export let onAutoFill: ((value: string) => void) | undefined = undefined;
	export let _class: string | undefined = undefined;

	let input: HTMLInputElement;
	let isInputFocused: boolean = false;

	onMount(() => {
		if (autofocus) {
			input.focus();
		}
	});

	const onClickAutofill = (_value: string) => {
		value = _value;
		isInputFocused = false;
		onAutoFill && onAutoFill(_value);
	};

	const onClickOutside = () => {
		isInputFocused = false;
	};
</script>

<div use:clickOutside on:click_outside={onClickOutside}>
	<input
		type="text"
		bind:value
		class="placeholder-gray-300 w-full bg-transparent {_class}"
		placeholder={isDisabled ? '' : placeholder}
		bind:this={input}
		on:focus={() => (isInputFocused = true)}
		disabled={isDisabled}
	/>
	<div class="relative">
		<div class="absolute stack bg-white">
			{#if isInputFocused && !value}
				{#each autofillValues as autofillValue}
					<button
						class="text-xs text-neutral-400 cursor-pointer hover:bg-gray-100 px-4 py-2 z-99"
						on:click={() => autofillValue && onClickAutofill(autofillValue)}
					>
						{autofillValue}
					</button>
				{/each}
			{/if}
		</div>
	</div>
</div>
