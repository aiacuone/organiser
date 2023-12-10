<script lang="ts">
	import { LogType_enum } from '$lib/types';
	import { v4 as uuidv4 } from 'uuid';
	import Time from './Logs/Time.svelte';
	import Todo from './Logs/Todo.svelte';
	import Question from './Logs/Question.svelte';
	import Important from './Logs/Important.svelte';
	import { page } from '$app/stores';

	export let type: LogType_enum;

	const [day, month] = $page.params.date.split('-');

	const date = new Date();
	date.setMonth(parseInt(month) - 1);
	date.setDate(parseInt(day));

	const defaultValues = {
		id: uuidv4(),
		title: '',
		content: '',
		reference: '',
		time: 0,
		isEditing: true,
		isCompleted: false,
		rating: 2 as 1 | 2 | 3,
		inputAutoFocus: true,
		question: '',
		date,
		editOnMount: true,
		listItems: [''],
		checkboxItems: [{ text: '', isChecked: false }]
	};
</script>

{#if type === LogType_enum.time}
	<Time {...defaultValues} />
{:else if type === LogType_enum.todo}
	<Todo {...defaultValues} />
{:else if type === LogType_enum.question}
	<Question {...defaultValues} />
{:else if type === LogType_enum.important}
	<Important {...defaultValues} />
{/if}
