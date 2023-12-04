<script lang="ts">
	import { logEnumNames, type Log_enum, type Log_int } from '$lib/types';

	export let logs: Log_int[];
	export let logKeyValueFilter: Record<Log_enum, boolean>;
	export let logKeyValueSortFunction: ([keyA]: [any], [keyB]: [any]) => number;
</script>

{#each logs as log}
	<div class="stack gap-2 log-stack p-2">
		{#each Object.entries(log)
			.filter(([key, value]) => logKeyValueFilter[key] && value)
			.sort(logKeyValueSortFunction) as [key, value]}
			<p class="capitalize"><b>{logEnumNames[key]}</b>: {value}</p>
		{/each}
	</div>
{/each}

<style>
	.log-stack:nth-child(odd) {
		background: rgb(246, 246, 246);
	}
</style>
