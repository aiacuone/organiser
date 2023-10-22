<script lang="ts">
	import { LogType_enum } from '$lib/types';
	import { v4 as uuidv4 } from 'uuid';
	import Time from './Logs/Time.svelte';
	import Todo from './Logs/Todo.svelte';
	import Question from './Logs/Question.svelte';
	import Important from './Logs/Important.svelte';

	export let type: LogType_enum;

	const sharedProps = {
		id: uuidv4(),
		date: new Date(),
		title: '',
		content: '',
		reference: '',
		time: 0.5,
		isEditing: true,
		isChecked: false,
		importance: 2,
		priority: 2,
		inputAutoFocus: true
	};
</script>

{#if type === LogType_enum.time}
	<Time {...sharedProps} content={['']} />
{:else if type === LogType_enum.todo}
	<Todo {...sharedProps} />
{:else if type === LogType_enum.question}
	<Question {...sharedProps} />
{:else if type === LogType_enum.important}
	<Important {...sharedProps} />
{/if}
