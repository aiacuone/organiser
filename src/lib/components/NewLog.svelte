<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { page } from '$app/stores';
	import Log from './Logs/Log.svelte';
	import type { LogType_enum, Log_int } from '$lib/types';

	export let type: LogType_enum;

	const [day, month] = $page.params.date.split('-');

	const date = new Date();
	date.setMonth(parseInt(month) - 1);
	date.setDate(parseInt(day));

	const initialLog: Log_int = {
		id: uuidv4(),
		title: '',
		reference: '',
		time: 0,
		rating: 2 as 1 | 2 | 3,
		date,
		listItems: [''],
		checkboxItems: [{ text: '', isChecked: false }],
		questions: [{ question: '', answer: '' }],
		space: $page.params.space,
		type: type
	};
</script>

<Log {initialLog} editOnMount />
