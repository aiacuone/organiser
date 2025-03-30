import { getDayMonthYearFromDate } from '$lib/utils'
import { getHyphenatedStringFromDate } from '$lib/utils/strings'
import { derived, writable, type Writable } from 'svelte/store'

export const selectedDate: Writable<Date> = writable()

export const selectedDateString = derived(selectedDate, ($selectedDate) => {
	if (!$selectedDate) return
	const { string } = getDayMonthYearFromDate($selectedDate)
	return string
})

export const selectedHyphenatedDateString = derived(selectedDate, ($selectedDate) => {
	if (!$selectedDate) return
	return getHyphenatedStringFromDate($selectedDate)
})

export const selectedDayString = derived(selectedDate, ($selectedDate) => {
	if (!$selectedDate) return
	const { dayString } = getDayMonthYearFromDate($selectedDate)
	return { string: dayString, sliced: dayString?.slice(0, 3) }
})
