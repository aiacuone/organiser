<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getLogs } from '$lib/api/logsLocalApi';
	import Important from '$lib/components/Logs/Important.svelte';
	import Question from '$lib/components/Logs/Question.svelte';
	import Time from '$lib/components/Logs/Time.svelte';
	import Todo from '$lib/components/Logs/Todo.svelte';
	import Search from '$lib/components/Search.svelte';
	import { LogType_enum, allLogs } from '$lib/types';

	import { objectToQueryString, replaceAllSpacesWithHyphens } from '$lib/utils/strings';
	import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { onMount } from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';

	const queryClient = useQueryClient();
	const defaultFilters = Object.fromEntries(new URLSearchParams($page.url.searchParams).entries());

	const filters: Writable<Record<string, string>> = writable(defaultFilters);

	let hasPageLoaded = false;
	let onSearchInputFocus: () => void;

	onMount(() => {
		hasPageLoaded = true;
		defaultFilters.search && onSearchInputFocus();
	});

	const searchParams = derived(filters, ($filters) => {
		return objectToQueryString($filters);
	});

	let timer;

	const debounce = (fn: () => any, delay = 500) => {
		const timeout = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn();
			}, delay);
		};
		timeout();
	};

	$: $filters,
		hasPageLoaded &&
			debounce(() => {
				const url = $searchParams
					? `${$page.url.pathname}?${$searchParams}`
					: `${$page.url.pathname}`;
				goto(url, { keepFocus: true });
			});

	const filteredLogsQuery = useQuery(
		'filteredLogs',
		() => {
			return getLogs({
				space: replaceAllSpacesWithHyphens($page.params.space),
				...$filters
			});
		},
		{
			onSuccess: () => {}
		}
	);

	const onClickClear = () => {
		$filters = {};
		queryClient.invalidateQueries('filteredLogs');
	};

	const updatedStateAndInvalidate = () => {
		$filters = Object.fromEntries(new URLSearchParams($page.url.searchParams).entries());
		queryClient.invalidateQueries('filteredLogs');
	};
	$: $page.url, updatedStateAndInvalidate();

	let headerContainerHeight: number;
	let parentContainerHeight: number;
	$: logContainerHeight = parentContainerHeight - headerContainerHeight - 20;

	onMount(() => {
		const onKeydown = (e) => {
			if (e.key === 'Escape') {
				goto(`/${$page.params.space}`);
			}
		};
		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<div class="stack flex-1 gap-3" bind:clientHeight={parentContainerHeight}>
	<div class="center flex flex-col sm:flex-row gap-2" bind:clientHeight={headerContainerHeight}>
		<Search
			bind:value={$filters.search}
			{onClickClear}
			showEnter={false}
			bind:onFocus={onSearchInputFocus}
		/>
		<div class="hstack gap-4 flex-wrap center">
			{#each allLogs as logKey, i}
				<label class="capitalize text-xs center gap-1">
					{logKey}
					<input
						type="checkbox"
						bind:checked={$filters[logKey]}
						on:change={() => {
							$filters = { ...$filters, [logKey]: $filters[logKey] };
						}}
					/>
				</label>
			{/each}
		</div>
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
