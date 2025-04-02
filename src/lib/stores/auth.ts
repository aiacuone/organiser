import { writable, type Writable } from 'svelte/store'

export const isAuthenticated = writable(false)
export const user: Writable = writable({})
export const popupOpen = writable(false)
export const error = writable()
export const isAuthLoading = writable(true)
