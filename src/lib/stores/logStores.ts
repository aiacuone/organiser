import { derived, writable, type Writable } from 'svelte/store';

export const currentlyEditing: Writable<null | string> = writable(null);

export const whichInputIsFocused: Writable<undefined | HTMLElement> = writable(undefined);

export const isAnInputFocused = derived(
	whichInputIsFocused,
	($whichInputIsFocused) => $whichInputIsFocused !== undefined
);

export const unfocusInput = () => whichInputIsFocused.set(undefined);
