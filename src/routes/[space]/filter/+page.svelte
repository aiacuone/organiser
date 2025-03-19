<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import ExportDialog from '$lib/components/Dialog/ExportDialog.svelte';
	import Log from '$lib/components/Logs/Log.svelte';
	import Search from '$lib/components/Search.svelte';
	import { icons } from '$lib/general/icons';
	import { searchValue, whichInputIsFocused } from '$lib/stores';
	import { allLogs, searchableInputs } from '$lib/types';
	import { arraysAreEqual } from '$lib/utils/arrays';
	import {
		entriesArrayToSearchParamsString,
		searchParamsStringToEntriesArray,
		replaceAllSpacesWithHyphens,
		camelCaseToLower
	} from '$lib/utils/strings';
	import Icon from '@iconify/svelte';
	import { useInfiniteQuery, useQueryClient } from '@sveltestack/svelte-query';
	import { onMount } from 'svelte';
	import { axios } from '$lib/general';
	import { useDisclosure, viewport } from '$lib';

	const queryClient = useQueryClient();
	const _searchParams = $derived(new URLSearchParams($page.url.searchParams));

	let searchParams = $derived({
		string: _searchParams.toString(),
		array: searchParamsStringToEntriesArray(_searchParams)
	});

	let filters = $derived(searchParams.array);

	const onClearFilters = () => goto(`/${$page.params.space}/filter`, { keepFocus: true });

	const onAddFilter = (filter: [string, string]) =>
		goto(
			`/${$page.params.space}/filter?${entriesArrayToSearchParamsString([...filters, filter])}`,
			{ keepFocus: true }
		);

	const onRemoveFilter = (filter: [string, string]) =>
		goto(
			`/${$page.params.space}/filter?${entriesArrayToSearchParamsString(filters.filter((f) => !arraysAreEqual(f, filter)))}`,
			{ keepFocus: true }
		);

	const setFilters = (filters: [string, string][]) =>
		goto(`/${$page.params.space}/filter?${entriesArrayToSearchParamsString(filters)}`, {
			keepFocus: true
		});

	const onClickClear = () => {
		onClearFilters();
		queryClient.invalidateQueries('filteredLogs');
		$searchValue = '';
	};

	let hasPageLoaded = $state(false);

	onMount(() => {
		hasPageLoaded = true;
		const hasSearchQuery = $page.url.searchParams.has('search');

		if (hasSearchQuery) {
			$searchValue = $page.url.searchParams.get('search') ?? '';
		}
	});

	let timer: any = $state(undefined);

	const debounce = (fn: () => any, delay = 500) => {
		const timeout = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn();
			}, delay);
		};
		timeout();
	};

	// I dont know what this is for. It may have something to do with the filter page being loaded with a search query. I think come back to this once you have a better understanding of the codebase.

	// let filtersValues = $derived({
	// 	string: (() => {
	// 		const string = entriesArrayToSearchParamsString(filters as Array<[string, string]>);
	// 		return { string };
	// 	})()
	// });

	// $effect(() => {
	// hasPageLoaded &&
	// 	filters &&
	// 	debounce(() => {
	// 		const url = filtersValues.string
	// 			? `${$page.url.pathname}?${filtersValues.string}`
	// 			: `${$page.url.pathname}`;
	// 		goto(url, { keepFocus: true });
	// 	});
	// });

	const fetchFilteredLogs = async ({ pageParam: skip = 0 }) => {
		const result = await axios.get(`/log`, {
			params: {
				space: replaceAllSpacesWithHyphens($page.params.space),
				skip,
				json: JSON.stringify(searchParams.array)
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

	$effect(() => {
		const updatedStateAndInvalidate = () => {
			setFilters(searchParams.array);
			queryClient.invalidateQueries('filteredLogs');
		};

		$page.url && updatedStateAndInvalidate();
	});

	let headerContainerHeight: number = $state(0);
	let parentContainerHeight: number = $state(0);

	const logContainerHeight: number = $derived(parentContainerHeight - headerContainerHeight - 20);

	onMount(() => {
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') goto(`/${$page.params.space}`, { keepFocus: true });
		};

		document.addEventListener('keydown', onKeydown);

		return () => document.removeEventListener('keydown', onKeydown);
	});

	const onGetNextPage = () => {
		if (!$filteredLogsQuery.isFetching) {
			$filteredLogsQuery.fetchNextPage();
		}
	};

	const onFilterChange = (filterValue: string[]) => {
		const hasMatchingFilter = filters.some((filter) => arraysAreEqual(filter, filterValue));

		if (hasMatchingFilter) {
			onRemoveFilter(filterValue as [string, string]);
		} else {
			onAddFilter(filterValue as [string, string]);
		}
	};

	const onSearch = () => {
		const removeAllSearchFilters = () =>
			goto(
				`/${$page.params.space}/filter?${entriesArrayToSearchParamsString(filters.filter((filter) => filter[0] !== 'search'))}`,
				{ keepFocus: true }
			);

		const isThereAnExistingSearchFilter = filters.some((filter) => filter[0] === 'search');

		if (isThereAnExistingSearchFilter) removeAllSearchFilters();

		if ($searchValue) onAddFilter(['search', $searchValue]);
		else removeAllSearchFilters();
	};

	const {
		isOpen: isExportDialogOpen,
		onOpen: openExportDialog,
		onClose: closeExportDialog
	} = useDisclosure();

	const onSearchChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const newValue = target.value;
		$searchValue = newValue;

		debounce(() => onSearch());
	};
</script>

<div bind:clientHeight={parentContainerHeight} class="stack flex-1 gap-3">
	<div bind:clientHeight={headerContainerHeight} class="center stack gap-2">
		<div class="hstack gap-3 flex-wrap center">
			<div class="hstack gap-3 border border-gray-100 py-1 px-2 rounded-md flex-wrap center">
				<Search value={$searchValue} onchange={onSearchChange} {onClickClear} showEnter={false} />
				<div class="hstack gap-2 {$searchValue ? 'opacity-100' : 'opacity-20'}">
					{#each searchableInputs as key}
						<label class="capitalize text-xs center gap-1 hstack gap-[2px]">
							{camelCaseToLower(key)}
							<input
								type="checkbox"
								onchange={() => onFilterChange(['searchType', key])}
								checked={filters.some((filterArray) =>
									arraysAreEqual(filterArray, ['searchType', key])
								)}
								disabled={!$searchValue}
							/>
						</label>
					{/each}
				</div>
				<Button onclick={openExportDialog}>
					<Icon icon={icons.export} height="20px" class="text-gray-400" />
				</Button>
			</div>
			<div class="hstack gap-2 flex-wrap center">
				{#each allLogs as key, i}
					<label class="capitalize text-xs center gap-1">
						{camelCaseToLower(key)}
						<input
							type="checkbox"
							onchange={() => onFilterChange(['type', key])}
							checked={filters.some((filterArray) => arraysAreEqual(filterArray, ['type', key]))}
						/>
					</label>
				{/each}
			</div>
		</div>
	</div>
	<div class="center">
		<div
			class="stack gap-6 hide-scrollbar flex-1 max-w-screen-lg {!!$whichInputIsFocused
				? 'overflow-y-hidden'
				: 'overflow-y-scroll'}"
			style={`max-height:${logContainerHeight}px`}
		>
			{#if $filteredLogsQuery.isLoading}
				{#each Array(5) as _}
					<div class="bg-neutral-100 rounded-sm h-[120px] w-full"></div>
				{/each}
			{:else if $filteredLogsQuery.isError}
				Error
			{:else if $filteredLogsQuery.data}
				{#each $filteredLogsQuery.data.pages as page}
					{#each page.data.logs as log}
						<Log initialLog={log} />
					{/each}
				{/each}
				<div class="center text-gray-300">
					{#if $filteredLogsQuery.isFetching}
						Loading more...
					{:else if $filteredLogsQuery.hasNextPage}
						<div use:viewport onenterViewport={onGetNextPage} class="h-10 w-full" />
					{:else}
						{$filteredLogsQuery.data.pages[0].data.total} Results
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<ExportDialog
	isOpen={$isExportDialogOpen}
	onOpen={openExportDialog}
	onClose={closeExportDialog}
	logsData={$filteredLogsQuery.data}
	isLoadingLogs={$filteredLogsQuery.isLoading}
	isLogsError={$filteredLogsQuery.isError}
	isFetchingLogs={$filteredLogsQuery.isFetching}
	hasNextLogsPage={$filteredLogsQuery.hasNextPage}
	getNextLogsPage={onGetNextPage}
/>
