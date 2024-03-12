import { writable, type Writable } from 'svelte/store';

export const currentlyEditing: Writable<null | string> = writable(null);

export const isDropdownOpen: Writable<boolean> = writable(false);
