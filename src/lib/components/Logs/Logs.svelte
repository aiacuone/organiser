<script lang="ts">
	import { LogType_enum, type Log_int } from '$lib/types';
	import { getMappedCheckboxItems, getMappedListItems, getMappedQuestions } from '$lib/utils';
	import Important from './Important.svelte';
	import Log from './Log.svelte';
	import Time from './Time.svelte';
	import Todo from './Todo.svelte';

	export let logs: Log_int[];
	[];
</script>

{#each logs as log}
	{@const { type, questions, checkboxItems, listItems, ...rest } = log}
	{#if type === LogType_enum.important && log.rating && listItems}
		<Important {...rest} rating={log.rating} listItems={getMappedListItems(listItems)} />
	{:else if type === LogType_enum.todo && log.rating && checkboxItems}
		<Log
			logType={type}
			{...rest}
			checkboxItems={getMappedCheckboxItems(checkboxItems)}
			rating={log.rating}
		/>
	{:else if type === LogType_enum.question && log.rating && questions}
		<Log logType={type} {...rest} questions={getMappedQuestions(questions)} rating={log.rating} />
	{:else if type === LogType_enum.time && listItems}
		<Time
			{...rest}
			title={log.title}
			reference={log.reference}
			time={log.time}
			listItems={getMappedListItems(listItems)}
		/>
	{/if}
{/each}
