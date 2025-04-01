import { writable, type Writable } from 'svelte/store'

// todo: make default false
export const isAuthenticated = writable(true)
export const user: Writable = writable({})
export const popupOpen = writable(false)
export const error = writable()
export const isAuthLoading = writable(true)
