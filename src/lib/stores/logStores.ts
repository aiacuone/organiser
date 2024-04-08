import type { Readable } from 'svelte/motion';
import { derived, writable, type Writable } from 'svelte/store';

export const currentlyEditing: Writable<null | string> = writable(null);

export const isDropdownOpen: Writable<boolean> = writable(false);

export const whichDropdownIsOpen: Writable<undefined | HTMLElement> = writable(undefined);

export const isADropdownOpen: Readable<boolean> = derived(
	whichDropdownIsOpen,
	($whichDropdownIsOpen) => !!$whichDropdownIsOpen
);
