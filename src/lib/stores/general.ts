import type { titlesAndReferences_int } from '$lib/types'
import { derived, writable, type Writable } from 'svelte/store'

export const darkMode = writable({
	boolean: true,
	darkStyles: {
		string: 'background:rgb(30, 30, 30); color:white',
		color: 'white',
		background: 'rgb(30, 30, 30)'
	},
	lightStyles: { string: 'background:white; color:black', background: 'white', color: 'black' }
})

export const titlesAndReferences: Writable<titlesAndReferences_int[]> = writable()

export const titles = derived(titlesAndReferences, ($titlesAndReferences) => {
	if (!$titlesAndReferences) return []
	return $titlesAndReferences.filter(({ title }) => title).map(({ title }) => title)
})

export const references = derived(titlesAndReferences, ($titlesAndReferences) => {
	if (!$titlesAndReferences) return []
	return $titlesAndReferences.filter(({ reference }) => reference).map(({ reference }) => reference)
})

export const searchValue = writable('')

export const spaces = writable([])
