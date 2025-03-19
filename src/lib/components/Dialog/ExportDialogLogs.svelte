<script lang="ts">
	import { logEnumNames, type Log_int, LogType_enum, Log_enum } from '$lib/types';

	interface Props {
		logs: Log_int[];
		logKeyValueFilter: Partial<Record<Log_enum, boolean>>;
		logKeyValueSortFunction: (a: [Log_enum, boolean], b: [Log_enum, boolean]) => number;
		typeFilter: Partial<Record<LogType_enum, boolean>>;
		showKeys: boolean;
	}

	let { logs, logKeyValueFilter, logKeyValueSortFunction, typeFilter, showKeys }: Props = $props();

	const logFilter = $derived(([key, value]: [Log_enum, any]) => {
		if (key === Log_enum.listItems) return value.length > 0;
		if (key === Log_enum.questions)
			return value.some(
				({ question, answer }: { question: string; answer: string }) => answer || question
			);
		if (key === Log_enum.checkboxItems) return value.some(({ text }: { text: string }) => text);
		return logKeyValueFilter[key] && value;
	});

	const filteredLogs = $derived(logs.filter(({ type }) => typeFilter[type]));
</script>

{#each filteredLogs as log}
	<div class="stack gap-2 log-stack p-2">
		{#each (Object.entries(log) as [Log_enum,any][]).filter(logFilter).sort(logKeyValueSortFunction) as [key, value]}
			{#if key === Log_enum.listItems}
				<ul>
					{#each value as listItem}
						<li>{listItem}</li>
					{/each}
				</ul>
			{:else if key === Log_enum.checkboxItems}
				<ul>
					{#each value as { isChecked, text }}
						<li class="{isChecked ? 'isChecked' : ''} checkbox">{text}</li>
					{/each}
				</ul>
			{:else}
				<p class="capitalize">
					{#if showKeys}
						<b>{logEnumNames[key as keyof Log_int]}</b>:
					{/if}
					{value}
				</p>
			{/if}
		{/each}
	</div>
{/each}

<style>
	.log-stack:nth-child(odd) {
		background: rgb(246, 246, 246);
	}

	.log-stack ul {
		list-style-type: disc;
		padding-left: 17px;
	}

	.isChecked {
		text-decoration: line-through;
	}

	.checkbox {
		list-style-type: circle;
	}
</style>
