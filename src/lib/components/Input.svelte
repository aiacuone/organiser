<script lang="ts">
	import { isDropdownOpen } from '$lib/stores';
	import { clickOutside } from '$lib/utils/clickAway';
	import { getContext, onMount } from 'svelte';
	import type { Readable } from 'svelte/motion';
	import { writable, type Writable } from 'svelte/store';

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

	const isEditing: Readable<boolean> = getContext('isEditing');

	const selectedAutofill: Writable<{ isUsingArrows: boolean; selected: number }> = writable({
		isUsingArrows: false,
		selected: -1
	});

	const onResetAutofill = () => {
		$selectedAutofill = { isUsingArrows: false, selected: -1 };
	};

	const onSelectAutofill = (index: number) => {
		$selectedAutofill = { isUsingArrows: true, selected: index };
	};

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
		if ($isEditing && isInputFocused) {
			isInputFocused = false;
			onResetAutofill();
		}
	};

	const _onFocus = () => {
		isInputFocused = true;
	};

	let slicedAutofillValues: string[] = [];

	$: _isDropdownOpen = isInputFocused && filteredAutofillValues.length > 0;
	$: _isDropdownOpen, $isEditing && ($isDropdownOpen = _isDropdownOpen);
	$: filteredAutofillValues = autofillValues.filter(
		(autofillValue) => autofillValue && autofillValue.includes(value)
	) as string[];
	$: value, onResetAutofill();
	$: {
		if ($selectedAutofill.selected <= 9) {
			slicedAutofillValues = filteredAutofillValues.slice(0, 10);
		} else if ($selectedAutofill.selected > 9) {
			slicedAutofillValues = filteredAutofillValues.slice(
				$selectedAutofill.selected + 1 - 10,
				$selectedAutofill.selected + 1
			);
		}
	}

	const onKeydown = (e) => {
		if (e.key === 'Backspace') {
			_onFocus();
		}
		if (e.key === 'ArrowUp') {
			if ($selectedAutofill.selected > 0) {
				onSelectAutofill($selectedAutofill.selected - 1);
			}
		}
		if (e.key === 'ArrowDown') {
			if ($selectedAutofill.selected < filteredAutofillValues.length - 1) {
				onSelectAutofill($selectedAutofill.selected + 1);
			}
		}
		if (e.key === 'Enter') {
			const isAutofillValueBeingSelected =
				$selectedAutofill !== undefined &&
				$selectedAutofill.selected !== undefined &&
				_isDropdownOpen;

			if (isAutofillValueBeingSelected) {
				onClickAutofill(filteredAutofillValues[$selectedAutofill.selected as number]);
			} else {
				onEnterKeydown();
			}
		}
	};

	const onAutofillWheeldown = (e) => {
		const isWheelUp = e.deltaY < 0;
		const indexOfFirstItem = filteredAutofillValues.indexOf(slicedAutofillValues[0]);

		if (isWheelUp) {
			if (indexOfFirstItem === 0) return;
			const result = filteredAutofillValues.slice(indexOfFirstItem - 1, indexOfFirstItem - 1 + 10);
			slicedAutofillValues = result;
		} else {
			const areThereAnyMoreItems = filteredAutofillValues.length > indexOfFirstItem + 10 + 1;
			if (!areThereAnyMoreItems) return;
			const result = filteredAutofillValues.slice(indexOfFirstItem + 1, indexOfFirstItem + 1 + 10);
			slicedAutofillValues = result;
		}
	};
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
	<div class="relative z-50 {_isDropdownOpen ? 'flex' : 'hidden'}">
		<div
			class="absolute stack bg-white border-l border-r border-b rounded-b-md w-full"
			on:wheel={onAutofillWheeldown}
		>
			{#each slicedAutofillValues as autofillValue, index}
				<button
					class="text-xs text-neutral-400 cursor-pointer {!$selectedAutofill.isUsingArrows &&
						'hover:bg-gray-100'} px-4 py-2 z-99 flex justify-start {$selectedAutofill.selected ===
						index ||
					($selectedAutofill.selected > 9 && index === 9)
						? 'bg-gray-100'
						: ''}"
					on:click={() => autofillValue && onClickAutofill(autofillValue)}
					on:mouseover={() => ($selectedAutofill.selected = index)}
					on:focus={() => ($selectedAutofill.selected = index)}
				>
					{autofillValue}
				</button>
			{/each}
		</div>
	</div>
</div>
