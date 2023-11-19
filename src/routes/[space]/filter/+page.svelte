<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Important from '$lib/components/Logs/Important.svelte';
	import Question from '$lib/components/Logs/Question.svelte';
	import Time from '$lib/components/Logs/Time.svelte';
	import Todo from '$lib/components/Logs/Todo.svelte';
	import Search from '$lib/components/Search.svelte';
	import { viewport } from '$lib/hooks';
	import { LogType_enum, allLogs, searchableInputs } from '$lib/types';
	import { arraysAreEqual } from '$lib/utils/arrays';
	import {
		arrayToSearchParamsString,
		searchParamsStringToArray,
		replaceAllSpacesWithHyphens,
		camelCaseToLower
	} from '$lib/utils/strings';
	import { useInfiniteQuery, useQueryClient } from '@sveltestack/svelte-query';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';

	const searchValue = writable('');

	const queryClient = useQueryClient();

	const searchParams = derived(page, ($page) => {
		const searchParams = new URLSearchParams($page.url.searchParams);

		const string = searchParams.toString();

		const array = searchParamsStringToArray(searchParams);

		return { string, array };
	});

	const filters: Writable<Array<Array<string>>> = writable($searchParams.array);
	$: $filters, console.log($filters);

	const filtersValues = derived(filters, ($filters) => {
		const string = arrayToSearchParamsString($filters);
		return { string };
	});

	const onClickClear = () => {
		$filters = [];
		queryClient.invalidateQueries('filteredLogs');
		$searchValue = '';
	};

	let hasPageLoaded = false;
	let onSearchInputFocus: () => void;

	onMount(() => {
		hasPageLoaded = true;
		const hasSearchQuery = $page.url.searchParams.has('search');

		if (hasSearchQuery) {
			onSearchInputFocus();
			$searchValue = $page.url.searchParams.get('search') ?? '';
		}
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
				const url = $filtersValues.string
					? `${$page.url.pathname}?${$filtersValues.string}`
					: `${$page.url.pathname}`;

				goto(url, { keepFocus: true });
			});

	const fetchFilteredLogs = async ({ pageParam: skip = 0 }) => {
		const result = await axios.get(`/log`, {
			params: {
				space: replaceAllSpacesWithHyphens($page.params.space),
				skip,
				json: JSON.stringify($searchParams.array)
			}
		});

		return result;
	};

	const filteredLogsQuery = useInfiniteQuery('filteredLogs', fetchFilteredLogs, {
		getNextPageParam: (lastGroup) => {
			const skip = 10;
			const total = lastGroup.data.total;
			const nextSkip = lastGroup.config.params.skip + skip;
			const hasNextPage = nextSkip < total;
			return hasNextPage ? nextSkip : undefined;
		}
	});

	const updatedStateAndInvalidate = () => {
		$filters = searchParamsStringToArray($page.url.searchParams);
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

	const onGetNextPage = () => {
		if (!$filteredLogsQuery.isFetching) {
			$filteredLogsQuery.fetchNextPage();
		}
	};

	const onFilterChange = (filterValue: string[]) => {
		const hasExistingValue = $filters.some((filter) => arraysAreEqual(filter, filterValue));

		if (hasExistingValue) {
			$filters = $filters.filter((filter) => !arraysAreEqual(filter, filterValue));
		} else {
			$filters = [...$filters, filterValue];
		}
	};

	const onSearch = () => {
		if ($filters.some((filter) => filter[0] === 'search')) {
			$filters = $filters.filter((filter) => filter[0] !== 'search');
		}

		if ($searchValue) {
			$filters = [...$filters, ['search', $searchValue]];
		} else {
			$filters = $filters.filter((filter) => filter[0] !== 'search');
		}
	};
</script>

<div class="stack flex-1 gap-3" bind:clientHeight={parentContainerHeight}>
	<div class="center stack gap-2" bind:clientHeight={headerContainerHeight}>
		<div class="hstack gap-3 flex-wrap center">
			<div class="hstack gap-3 border border-gray-100 py-1 px-2 rounded-md flex-wrap center">
				<Search
					bind:value={$searchValue}
					onChange={(e) => debounce(() => onSearch())}
					{onClickClear}
					showEnter={false}
					bind:onFocus={onSearchInputFocus}
				/>
				<div class="hstack gap-2 {$searchValue ? 'opacity-100' : 'opacity-20'}">
					{#each searchableInputs as key}
						<label class="capitalize text-xs center gap-1 hstack gap-[2px]">
							{camelCaseToLower(key)}
							<input
								type="checkbox"
								on:change={() => onFilterChange(['searchType', key])}
								checked={$filters.some((filterArray) =>
									arraysAreEqual(filterArray, ['searchType', key])
								)}
								disabled={!$searchValue}
							/>
						</label>
					{/each}
				</div>
			</div>
			<div class="hstack gap-2 flex-wrap center">
				{#each allLogs as key, i}
					<label class="capitalize text-xs center gap-1">
						{camelCaseToLower(key)}
						<input
							type="checkbox"
							on:change={() => onFilterChange(['type', key])}
							checked={$filters.some((filterArray) => arraysAreEqual(filterArray, ['type', key]))}
						/>
					</label>
				{/each}
			</div>
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
				{#each $filteredLogsQuery.data.pages as page}
					{#each page.data.logs as log}
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
				{/each}
				<div class="center text-gray-300">
					{#if $filteredLogsQuery.isFetching}
						Loading more...
					{:else if $filteredLogsQuery.hasNextPage}
						<div use:viewport on:enterViewport={onGetNextPage} class="h-10 w-full" />
					{:else}
						{$filteredLogsQuery.data.pages[0].data.total} Results
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
