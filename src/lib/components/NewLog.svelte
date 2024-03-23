<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { page } from '$app/stores';
	import { getMappedCheckboxItems, getMappedListItems, getMappedQuestions } from '$lib/utils';
	import Log from './Logs/Log.svelte';
	import type { LogType_enum, MappedLog_int } from '$lib/types';
	import { writable } from 'svelte/store';

	export let type: LogType_enum;

	const [day, month] = $page.params.date.split('-');

	const date = new Date();
	date.setMonth(parseInt(month) - 1);
	date.setDate(parseInt(day));

	const mappedLog: MappedLog_int = {
		id: uuidv4(),
		title: '',
		reference: '',
		time: 0,
		rating: 2 as 1 | 2 | 3,
		inputAutoFocus: true,
		date,
		listItems: getMappedListItems(['']),
		checkboxItems: getMappedCheckboxItems([{ text: '', isChecked: false }]),
		questions: getMappedQuestions([{ question: '', answer: '' }]),
		space: $page.params.space,
		type: type
	};
</script>

<Log log={writable({ ...mappedLog })} initialLog={writable({ ...mappedLog })} editOnMount />
