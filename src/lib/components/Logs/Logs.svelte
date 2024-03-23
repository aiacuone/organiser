<script lang="ts">
	import type { Log_int } from '$lib/types';
	import { getMappedCheckboxItems, getMappedListItems, getMappedQuestions } from '$lib/utils';
	import { writable } from 'svelte/store';
	import Log from './Log.svelte';

	export let logs: Log_int[];
</script>

{#each logs as log}
	{@const mappedLog = {
		...log,
		questions: getMappedQuestions(log.questions),
		checkboxItems: getMappedCheckboxItems(log.checkboxItems),
		listItems: getMappedListItems(log.listItems),
		inputAutoFocus: false,
		rating: log.rating || 2,
		title: log.title || '',
		reference: log.reference || '',
		time: log.time || 0
	}}

	<Log log={writable({ ...mappedLog })} initialLog={writable({ ...mappedLog })} />
{/each}
