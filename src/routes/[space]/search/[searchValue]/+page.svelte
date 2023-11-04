<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getFilteredLogs } from '$lib/api/logsLocalApi';
	import Important from '$lib/components/Logs/Important.svelte';
	import Question from '$lib/components/Logs/Question.svelte';
	import Time from '$lib/components/Logs/Time.svelte';
	import Todo from '$lib/components/Logs/Todo.svelte';
	import Search from '$lib/components/Search.svelte';
	import { LogType_enum } from '$lib/types';
	import { debounce } from '$lib/utils/general';
	import { replaceAllSpacesWithHyphens } from '$lib/utils/strings';
	import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { onMount } from 'svelte';

	const queryClient = useQueryClient();

	let searchValue: string = $page.params.searchValue;

	const filteredLogsQuery = useQuery(
		'filteredLogs',
		() => {
			return getFilteredLogs({
				space: replaceAllSpacesWithHyphens($page.params.space),
				value: searchValue
			});
		},
		{
			onSuccess: () => {}
		}
	);

	const onClickClear = () => {
		searchValue = '';
		queryClient.invalidateQueries('filteredLogs');
	};

	const onChange = (e) => {
		searchValue = e.target.value;
		debounce(() => {
			queryClient.invalidateQueries('filteredLogs');
		}, 500);
	};

	let headerContainerHeight: number;
	let parentContainerHeight: number;
	$: logContainerHeight = parentContainerHeight - headerContainerHeight - 20;

	onMount(() => {
		const onKeydown = (e) => {
			if (e.key === 'Escape') {
				window.history.back();
			}
		};
		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<div class="stack flex-1 gap-3" bind:clientHeight={parentContainerHeight}>
	<div class="center" bind:clientHeight={headerContainerHeight}>
		<Search bind:value={searchValue} {onClickClear} {onChange} showEnter={false} />
	</div>
	<div class="center">
		<div
			class="stack gap-6 overflow-y-scroll hide-scrollbar flex-1 max-w-screen-lg"
			style={`max-height:${logContainerHeight}px`}
		>
			{#if $filteredLogsQuery.isLoading}
				{#each Array(5) as _}
					<div class="bg-neutral-100 rounded-sm h-[120px] w-full" />
				{/each}
			{:else if $filteredLogsQuery.isError}
				Error
			{:else if $filteredLogsQuery.data}
				{#each $filteredLogsQuery.data as log}
					{@const { type, ...rest } = log}
					{#if type === LogType_enum.important && log.importance && log.content}
						<Important {...rest} importance={log.importance} content={log.content} />
					{:else if type === LogType_enum.todo && log.priority && log.content}
						<Todo
							{...rest}
							priority={log.priority}
							isCompleted={log.isCompleted}
							content={log.content}
						/>
					{:else if type === LogType_enum.question && log.importance && log.question}
						<Question {...rest} importance={log.importance} content={log.content} />
					{:else if type === LogType_enum.time && log.title}
						<Time
							{...rest}
							title={log.title}
							reference={log.reference}
							time={log.time}
							bullets={log.bullets}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
</div>
