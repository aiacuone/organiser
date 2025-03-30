<script lang="ts">
	import Button from '../Button.svelte'
	import Dialog from './Dialog.svelte'
	import {
		logEnumNames,
		Log_enum,
		type Log_int,
		LogType_enum,
		LocalStorage_enum,
		logTypeEnumNames
	} from '$lib/types'
	import {
		camelCaseToCapitalized,
		copyToClipboard,
		downloadAsCSV,
		getLocalStorage,
		setLocalStorage
	} from '$lib/utils'
	import { useDisclosure, viewport } from '$lib/hooks'
	import type { InfiniteData } from '@sveltestack/svelte-query'
	import type { AxiosResponse } from 'axios'
	import ExportDialogLogs from './ExportDialogLogs.svelte'
	import Icon from '@iconify/svelte'
	import { icons } from '$lib/general/icons'
	import { onMount } from 'svelte'

	interface CheckboxProps {
		object: Record<string, boolean>
		key: string
		label: string
	}
	interface Props extends SvelteAllProps {
		isOpen: boolean
		onOpen: () => void
		onClose: () => void
		isLoadingLogs: boolean
		isFetchingLogs: boolean
		isLogsError: boolean
		logsData?: InfiniteData<AxiosResponse<any, any>>
		logs?: Log_int[]
		hasNextLogsPage?: boolean
		getNextLogsPage?: () => void
	}

	let {
		isOpen,
		onOpen,
		onClose,
		isLoadingLogs,
		isFetchingLogs,
		isLogsError,
		logsData,
		logs,
		hasNextLogsPage,
		getNextLogsPage
	}: Props = $props()

	let defaultLogKeyValueFilter: Partial<Record<Log_enum, boolean>> = {
		[Log_enum.id]: false,
		[Log_enum.date]: true,
		[Log_enum.title]: true,
		[Log_enum.reference]: true,
		[Log_enum.time]: false,
		[Log_enum.type]: true,
		[Log_enum.space]: false,
		[Log_enum.listItems]: true,
		[Log_enum.checkboxItems]: true,
		[Log_enum.lastUpdated]: false,
		[Log_enum.rating]: false,
		[Log_enum.questions]: true
	}

	let logKeyValueFilter = $state({ ...defaultLogKeyValueFilter })

	const defaultTypeFilterData = Object.fromEntries(
		Object.values(LogType_enum).map((type) => [type, true])
	) as Partial<Record<LogType_enum, boolean>>

	let typeFilter = $state({ ...defaultTypeFilterData })

	const defaultPreferences: Record<string, boolean> = {
		showKeys: true
	}

	let preferences = $state({ ...defaultPreferences })

	onMount(() => {
		const [storageLogKeyValueFilter, storageTypeFilter, storagePreferences] = getLocalStorage([
			LocalStorage_enum.exportLogKeyValueFilterDefaults,
			LocalStorage_enum.exportTypeFilterDefaults,
			LocalStorage_enum.exportPreferenceDefaults
		])

		storageLogKeyValueFilter && (logKeyValueFilter = storageLogKeyValueFilter)
		storageTypeFilter && (typeFilter = storageTypeFilter)
		storagePreferences && (preferences = storagePreferences)
	})

	const logKeyValueSortFunction: (a: [Log_enum, boolean], b: [Log_enum, boolean]) => number = (
		[keyA],
		[keyB]
	) => {
		const keyOrder: Log_enum[] = [
			Log_enum.title,
			Log_enum.reference,
			Log_enum.date,
			Log_enum.type,
			Log_enum.questions,
			Log_enum.listItems,
			Log_enum.checkboxItems,
			Log_enum.rating,
			Log_enum.space,
			Log_enum.time,
			Log_enum.lastUpdated,
			Log_enum.id
		]
		const indexA = keyOrder.indexOf(keyA)
		const indexB = keyOrder.indexOf(keyB)

		return indexA - indexB
	}

	let logsContainer: HTMLDivElement
	let containerHeight: number = $state(0)
	let headerHeight: number = $state(0)
	let buttonsContainerHeight: number = $state(0)
	let footerButtonsContainerHeight: number = $state(0)

	$effect(() => {
		containerHeight &&
			(logsContainer.style.height = `${
				containerHeight - headerHeight - buttonsContainerHeight - footerButtonsContainerHeight
			}px`)
	})

	const onCopy = (index: number) => {
		copyToClipboard(logsContainer.innerText)
		footerButtons[index].isAnimating = true
		setTimeout(() => {
			footerButtons[index].isAnimating = false
		}, 1500)
	}

	const onCsv = () => {
		downloadAsCSV(logsContainer.innerText)
	}

	const onReset = () => {
		const [storageLogKeyValueFilter, storageTypeFilter, storagePreferences] = getLocalStorage([
			LocalStorage_enum.exportLogKeyValueFilterDefaults,
			LocalStorage_enum.exportTypeFilterDefaults,
			LocalStorage_enum.exportPreferenceDefaults
		])

		const resetLogKeyValueFilter = storageLogKeyValueFilter ?? defaultLogKeyValueFilter
		const resetTypeFilter = storageTypeFilter ?? defaultTypeFilterData
		const resetPreferences = storagePreferences ?? defaultPreferences

		typeFilter = { ...resetTypeFilter }
		logKeyValueFilter = { ...resetLogKeyValueFilter }
		preferences = { ...resetPreferences }
	}

	const onConfirmSetDefault = () => {
		setLocalStorage([
			{ key: LocalStorage_enum.exportLogKeyValueFilterDefaults, value: logKeyValueFilter },
			{ key: LocalStorage_enum.exportTypeFilterDefaults, value: typeFilter },
			{ key: LocalStorage_enum.exportPreferenceDefaults, value: preferences }
		])

		onCloseDefaultSelection()
	}

	const onUnselectAll = () => {
		const makeAllFalse = (object: Record<string, boolean>) =>
			Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: false }), {})

		typeFilter = makeAllFalse({ ...typeFilter })
		logKeyValueFilter = makeAllFalse({ ...logKeyValueFilter } as Record<Log_enum, boolean>)
		preferences = makeAllFalse({ ...preferences })
	}

	const onSelectAll = () => {
		const makeAllTrue = (object: Record<string, boolean>) =>
			Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: true }), {})

		typeFilter = makeAllTrue({ ...typeFilter })
		logKeyValueFilter = makeAllTrue({ ...logKeyValueFilter } as Record<Log_enum, boolean>)
		preferences = makeAllTrue({ ...preferences })
	}

	const {
		isOpen: isDefaultSelectionOpen,
		onOpen: onOpenDefaultSelection,
		onClose: onCloseDefaultSelection
	} = useDisclosure()

	const selectButtons = [
		{
			icon: icons.all,
			onclick: onSelectAll
		},
		{
			icon: icons.cross,
			onclick: onUnselectAll
		},
		{
			icon: icons.reset,
			onclick: onReset
		},
		{
			icon: icons.save,
			onclick: () => onOpenDefaultSelection()
		}
	]

	const confirmSaveDefaultButtons = [
		{
			icon: icons.tick,
			onclick: () => onConfirmSetDefault()
		},
		{
			icon: icons.cross,
			onclick: () => onCloseDefaultSelection()
		}
	]

	const footerButtons = [
		{
			onclick: onCopy,
			label: 'Copy',
			isAnimating: false,
			animatingText: 'Copied ✅'
		},
		{
			onclick: onCsv,
			label: 'CSV',
			key: 'csv'
		},
		{
			onclick: onClose,
			label: 'Close',
			key: 'close'
		}
	]

	const logKeyValueFilterFilter = $derived(
		(key: string) =>
			![Log_enum.id, Log_enum.lastUpdated, Log_enum.rating, Log_enum.space, Log_enum.time].includes(
				key as keyof Log_int
			)
	)
</script>

{#snippet checkbox({object,key,label}:CheckboxProps)}
	{@const checked = object[key]}
	{@const onchange = () => (object[key] = !object[key])}

	<div class="hstack gap-2">
		<label class="capitalize">
			{label}
			<input {checked} type="checkbox" {onchange} />
		</label>
	</div>
{/snippet}

<Dialog {isOpen} {onOpen} {onClose} _class="h-full w-full max-w-screen-lg">
	<div bind:clientHeight={containerHeight} class="stack gap-3 w-full h-full text-sm">
		<header bind:clientHeight={headerHeight} class="text-center">Export/Copy</header>
		<div bind:clientHeight={buttonsContainerHeight} class="stack gap-2">
			<div class="flex flex-wrap gap-y-1 gap-x-2 center">
				{#each Object.keys(logKeyValueFilter).filter(logKeyValueFilterFilter) as key}
					{@render checkbox({ object: logKeyValueFilter, key, label:logEnumNames[key as Log_enum] })}
				{/each}
			</div>
			<div class="flex flex-wrap gap-y-1 gap-x-2 center">
				{#each Object.keys(typeFilter) as key}
					{@render checkbox({ object: typeFilter, key, label:logTypeEnumNames[key as LogType_enum] })}
				{/each}
			</div>
			<div class="flex flex-wrap gap-y-1 gap-x-2 center">
				{#each Object.keys(preferences) as key}
					{@render checkbox({ object: preferences, key, label: camelCaseToCapitalized(key) })}
				{/each}
			</div>
			<div class="hstack gap-3 center">
				{#each selectButtons as { icon, onclick }}
					<Button {onclick}>
						<Icon {icon} class="text-gray-400" />
					</Button>
				{/each}
			</div>
		</div>

		<div bind:this={logsContainer} class="stack flex-1 overflow-y-scroll hide-scrollbar">
			{#if isLoadingLogs}
				{#each Array(5) as _}
					<div class="bg-neutral-100 rounded-sm h-[120px] w-full"></div>
				{/each}
			{:else if isLogsError}
				Error
			{:else if logsData?.pages}
				{#each logsData.pages as page}
					<ExportDialogLogs
						logs={page.data.logs}
						{logKeyValueSortFunction}
						{logKeyValueFilter}
						{typeFilter}
						showKeys={preferences.showKeys}
					/>
				{/each}
				<div class="center text-gray-300">
					{#if isFetchingLogs}
						Loading more...
					{:else if hasNextLogsPage}
						<div use:viewport onenterViewport={getNextLogsPage} class="h-10 w-full"></div>
					{:else}
						{logsData.pages[0].data.total} Results
					{/if}
				</div>
			{:else if logs}
				<ExportDialogLogs
					{logs}
					{logKeyValueSortFunction}
					{logKeyValueFilter}
					{typeFilter}
					showKeys={preferences.showKeys}
				/>
			{/if}
		</div>
		<div bind:clientHeight={footerButtonsContainerHeight} class="hstack center gap-2">
			{#each footerButtons as { onclick, label }, index}
				<Button onclick={() => onclick(index)}>
					{#if footerButtons[index].isAnimating}
						{footerButtons[index].animatingText}
					{:else}
						{label}
					{/if}
				</Button>
			{/each}
		</div>
	</div>
</Dialog>

<Dialog
	onOpen={onOpenDefaultSelection}
	onClose={onCloseDefaultSelection}
	isOpen={$isDefaultSelectionOpen}
>
	<div class="stack gap-2">
		<p>Are you sure you want to create a new default selection?</p>
		<div class="hstack gap-5 center">
			{#each confirmSaveDefaultButtons as { icon, onclick }}
				<Button {onclick}>
					<Icon {icon} class="text-gray-400" />
				</Button>
			{/each}
		</div>
	</div>
</Dialog>
