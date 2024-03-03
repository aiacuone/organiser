<script lang="ts">
	import { LogType_enum, type Log_int } from '$lib/types';
	import Important from './Important.svelte';
	import Question from './Question.svelte';
	import Time from './Time.svelte';
	import Todo from './Todo.svelte';

	export let logs: Log_int[];
	[];
</script>

{#each logs as log}
	{@const { type, ...rest } = log}
	{#if type === LogType_enum.important && log.rating && log.listItems}
		<Important {...rest} rating={log.rating} listItems={log.listItems} />
	{:else if type === LogType_enum.todo && log.rating && log.checkboxItems}
		<Todo {...rest} checkboxItems={log.checkboxItems} rating={log.rating} />
	{:else if type === LogType_enum.question && log.rating && log.questions}
		<Question questions={log.questions} rating={log.rating} {...rest} />
	{:else if type === LogType_enum.time && log.listItems}
		<Time
			{...rest}
			title={log.title}
			reference={log.reference}
			time={log.time}
			listItems={log.listItems}
		/>
	{/if}
{/each}
