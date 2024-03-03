<script lang="ts">
	import { logEnumNames, type Log_enum, type Log_int, LogType_enum } from '$lib/types';

	export let logs: Log_int[];
	export let logKeyValueFilter: Record<Log_enum, boolean>;
	export let logKeyValueSortFunction: (a: [Log_enum, boolean], b: [Log_enum, boolean]) => number;
	export let typeFilter: Record<LogType_enum, boolean>;
	export let showKeys: boolean;
</script>

{#each logs.filter(({ type }) => typeFilter[type]) as log}
	<div class="stack gap-2 log-stack p-2">
		{#each Object.entries(log)
			.filter(([key, value]) => logKeyValueFilter[key] && value)
			.sort(logKeyValueSortFunction) as [key, value]}
			{#if key === 'listItems'}
				<ul>
					{#each value as listItem}
						<li>{listItem}</li>
					{/each}
				</ul>
			{:else if key === 'checkboxItems'}
				<ul>
					{#each value as { isChecked, text }}
						<li class="{isChecked ? 'isChecked' : ''} checkbox">{text}</li>
					{/each}
				</ul>
			{:else}
				<p class="capitalize">
					{#if showKeys}
						<b>{logEnumNames[key]}</b>:
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
