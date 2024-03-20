<script lang="ts">
	import { isDropdownOpen } from '$lib/stores';
	import { clickOutside } from '$lib/utils/clickAway';
	import { getContext, onMount } from 'svelte';

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
	export let onChange: (event: Event) => void = () => {};
	export let onEnterKeydown: () => void = () => {};
	export const onFocus: () => void = () => {
		input && input.focus();
	};

	let input: HTMLInputElement;
	let isInputFocused: boolean = false;

	const onEditLog: (() => void) | undefined = getContext('onEditLog');

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

	const _onFocus = () => {
		isInputFocused = true;
	};
	const onKeydown = (e) => {
		if (e.key === 'Enter') {
			onEnterKeydown();
		}
	};

	$: _isDropdownOpen = isInputFocused && !value && autofillValues.length > 0;
	$: _isDropdownOpen, ($isDropdownOpen = _isDropdownOpen);
</script>

<div use:clickOutside on:click_outside={onClickOutside} class="relative">
	<input
		type="text"
		bind:value
		class="placeholder-gray-300 w-full bg-transparent text-sm outline-none {_class}"
		placeholder={isDisabled ? '' : placeholder}
		bind:this={input}
		on:focus={_onFocus}
		on:input={onChange}
		on:keydown={onKeydown}
	/>
	{#if _isDropdownOpen}
		<div class="relative z-50">
			<div class="absolute stack bg-white border-l border-r border-b rounded-b-md w-full">
				{#each autofillValues as autofillValue}
					<button
						class="text-xs text-neutral-400 cursor-pointer hover:bg-gray-100 px-4 py-2 z-99 flex justify-start"
						on:click={() => autofillValue && onClickAutofill(autofillValue)}
					>
						{autofillValue}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
