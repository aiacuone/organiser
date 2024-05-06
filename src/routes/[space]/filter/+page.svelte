<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import ExportDialog from '$lib/components/Dialog/ExportDialog.svelte';
	import Log from '$lib/components/Logs/Log.svelte';
	import Search from '$lib/components/Search.svelte';
	import { icons } from '$lib/general/icons';
	// import { viewport } from '$lib/hooks'; todo:svelte 5
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
	import { derived, writable, type Writable } from 'svelte/store';
	import { axios } from '$lib/general';
	import { useDisclosure } from '$lib';

	const queryClient = useQueryClient();

	const searchParams = derived(page, ($page) => {
		const searchParams = new URLSearchParams($page.url.searchParams);

		const string = searchParams.toString();

		const array = searchParamsStringToEntriesArray(searchParams);

		return { string, array };
	});

	const filters: Writable<Array<Array<string>>> = writable($searchParams.array);

	const filtersValues = derived(filters, ($filters) => {
		const string = entriesArrayToSearchParamsString($filters as Array<[string, string]>);
		return { string };
	});

	const onClickClear = () => {
		$filters = [];
		queryClient.invalidateQueries('filteredLogs');
		$searchValue = '';
	};

	let hasPageLoaded = $state(false);
	let onSearchInputFocus: () => void = $state(() => {});

	onMount(() => {
		hasPageLoaded = true;
		const hasSearchQuery = $page.url.searchParams.has('search');

		if (hasSearchQuery) {
			onSearchInputFocus();
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

	$effect(() => {
		hasPageLoaded &&
			$filters &&
			debounce(() => {
				const url = $filtersValues.string
					? `${$page.url.pathname}?${$filtersValues.string}`
					: `${$page.url.pathname}`;

				goto(url, { keepFocus: true });
			});
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
		$filters = searchParamsStringToEntriesArray($page.url.searchParams);
		queryClient.invalidateQueries('filteredLogs');
	};

	$effect(() => {
		$page.url && updatedStateAndInvalidate();
	});

	let headerContainerHeight: number = $state(0);
	let parentContainerHeight: number = $state(0);

	const logContainerHeight: number = $derived(parentContainerHeight - headerContainerHeight - 20);

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

	const {
		isOpen: isExportDialogOpen,
		onOpen: openExportDialog,
		onClose: closeExportDialog
	} = useDisclosure();
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
								onchange={() => onFilterChange(['searchType', key])}
								checked={$filters.some((filterArray) =>
									arraysAreEqual(filterArray, ['searchType', key])
								)}
								disabled={!$searchValue}
							/>
						</label>
					{/each}
				</div>
				<Button onClick={openExportDialog}>
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
							checked={$filters.some((filterArray) => arraysAreEqual(filterArray, ['type', key]))}
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
						<!-- todo:svelte 5 -->
						<!-- <div use:viewport on:enterViewport={onGetNextPage} class="h-10 w-full" /> -->
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
