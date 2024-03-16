<script lang="ts">
	import { LogType_enum } from '$lib/types';
	import { v4 as uuidv4 } from 'uuid';
	import Time from './Logs/Time.svelte';
	import Todo from './Logs/Todo.svelte';
	// import Question from './Logs/Question.svelte';
	import Important from './Logs/Important.svelte';
	import { page } from '$app/stores';
	import { getMappedCheckboxItems, getMappedListItems, getMappedQuestions } from '$lib/utils';
	import Log from './Logs/Log.svelte';

	export let type: LogType_enum;

	const [day, month] = $page.params.date.split('-');

	const date = new Date();
	date.setMonth(parseInt(month) - 1);
	date.setDate(parseInt(day));

	const defaultValues = {
		id: uuidv4(),
		title: '',
		reference: '',
		time: 0,
		rating: 2 as 1 | 2 | 3,
		inputAutoFocus: true,
		question: '',
		date,
		editOnMount: true,
		listItems: getMappedListItems(['']),
		checkboxItems: getMappedCheckboxItems([{ text: '', isChecked: false }]),
		questions: getMappedQuestions([{ question: '' }])
	};
</script>

{#if type === LogType_enum.time}
	<Log logType={type} {...defaultValues} />
{:else if type === LogType_enum.todo}
	<Log logType={type} {...defaultValues} />
{:else if type === LogType_enum.question}
	<Log logType={type} {...defaultValues} />
{:else if type === LogType_enum.important}
	<Important {...defaultValues} />
{/if}
