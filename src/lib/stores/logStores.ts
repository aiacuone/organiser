import { derived, writable, type Writable } from 'svelte/store'

export const currentlyEditing: Writable<null | string> = writable(null)

export const whichInputIsFocused: Writable<undefined | HTMLElement> = writable(undefined)

export const isAnInputFocused = derived(
	whichInputIsFocused,
	($whichInputIsFocused) => $whichInputIsFocused !== undefined
)

export const unfocusStoreInput = () => whichInputIsFocused.set(undefined)

export const whichAutofillIsOpen: Writable<undefined | HTMLElement> = writable(undefined)

export const isAnAutofillOpen = derived(
	whichAutofillIsOpen,
	($whichAutofillIsOpen) => $whichAutofillIsOpen !== undefined
)

export const closeAutofill = () => whichAutofillIsOpen.set(undefined)
