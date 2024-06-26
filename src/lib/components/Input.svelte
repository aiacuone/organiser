<script lang="ts">
	import {
		whichAutofillIsOpen,
		closeAutofill,
		isAnAutofillOpen,
		unfocusStoreInput,
		whichInputIsFocused
	} from '$lib/stores';
	import { onKeydown } from '$lib/utils';
	import { clickOutside } from '$lib/utils/clickAway';
	import { onMount } from 'svelte';
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
	export let onFocus: (() => void) | undefined = undefined;
	export let input: HTMLElement | undefined = undefined;
	export let isEditing: boolean = false;

	let isInputFocused = false;
	$: isAutofillOpen = isEditing && isInputFocused && autofillValues.length > 0;

	$: {
		if (isAutofillOpen) $whichAutofillIsOpen = input;
	}

	$: {
		if ($whichInputIsFocused === input) {
			isInputFocused = true;
		} else {
			isInputFocused = false;
		}
	}

	const unfocusInput = () => {
		// todo Svelte 5: Check if this is fixed with svelte 5
		//Unfortunately I needed to have 2 sources of truth, 1 in the component and 1 in the store. The reason for this is because on the first click of the app, if the item was an input, the item wouldnt focus. This may be fixed in svelte 5?
		isInputFocused = false;
		unfocusStoreInput();
	};

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

	onMount(() => {
		if (autofocus) {
			input && input.focus();
		}
		return () => {
			unfocusInput();
		};
	});

	const onClickAutofill = (_value: string) => {
		value = _value;
		unfocusInput();
		onAutoFill && onAutoFill(_value);
	};

	const onClickOutside = () => {
		if (isEditing && isInputFocused) {
			unfocusInput();
			onResetAutofill();
		}
	};

	const _onFocus = () => {
		isInputFocused = true;
		onFocus && onFocus();
	};

	let slicedAutofillValues: string[] = [];

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

	const _onKeydown = (e) => {
		onKeydown(e, {
			ArrowUp: () => {
				e.preventDefault();
				if ($selectedAutofill.selected > 0) {
					onSelectAutofill($selectedAutofill.selected - 1);
				}
			},
			ArrowDown: () => {
				e.preventDefault();
				if ($selectedAutofill.selected < filteredAutofillValues.length - 1) {
					onSelectAutofill($selectedAutofill.selected + 1);
				}
			},
			Backspace: _onFocus,
			Enter: () => {
				const isAutofillValueBeingSelected =
					$selectedAutofill !== undefined &&
					$selectedAutofill.selected !== undefined &&
					isAutofillOpen;

				if (isAutofillValueBeingSelected) {
					onClickAutofill(filteredAutofillValues[$selectedAutofill.selected as number]);
				} else {
					onEnterKeydown();
				}
			},
			Escape: () => {
				unfocusInput();
				$isAnAutofillOpen && closeAutofill();
			}
		});
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
	<!-- cannot add on:focus to input because it is causing focusing issues -->
	<input
		type="text"
		bind:value
		class="placeholder-gray-300 w-full bg-transparent text-sm outline-none {_class}"
		placeholder={isDisabled ? '' : placeholder}
		bind:this={input}
		on:input={onChange}
		on:keydown={_onKeydown}
		on:click={_onFocus}
	/>
	<div class="relative z-50 {isEditing && isAutofillOpen ? 'flex' : 'hidden'}">
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
