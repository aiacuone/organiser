<script lang="ts">
	import { LogListType_enum, type Log_int } from '$lib/types';
	import { getMappedCheckboxItems, getMappedListItems, getMappedQuestions } from '$lib/utils';
	import Log from './Log.svelte';

	export let logs: Log_int[];
</script>

{#each logs as log}
	{@const { questions, checkboxItems, listItems, type, listType, ...rest } = log}
	<Log
		questions={questions && getMappedQuestions(questions)}
		checkboxItems={checkboxItems && getMappedCheckboxItems(checkboxItems)}
		listItems={listItems &&
			(listType === LogListType_enum.checkbox
				? //TODO: Fix these with svelte 5 upgrade
				  getMappedCheckboxItems(listItems)
				: getMappedListItems(listItems))}
		logType={type}
		{listType}
		{...rest}
	/>
{/each}
