<script lang="ts">
	import IncrementDecrement from './Buttons/IncrementDecrement.svelte';
	import {
		getCheckboxItemsFromMappedListItems,
		getDayMonthYearFromDate,
		getListItemsFromMappedCheckboxItems,
		logIcons
	} from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { LogListType_enum, LogType_enum, allLogListTypes, type MappedLog_int } from '$lib/types';
	import { icons } from '$lib/general/icons';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import LogButton from './Buttons/LogButton.svelte';
	import type { Writable } from 'svelte/store';

	export let onDelete: () => void;
	export let onAccept: () => void;
	export let onAddItem: () => void;
	export let incrementDecrementProps:
		| {
				onIncrement: () => void;
				onDecrement: () => void;
				max: number;
				min: number;
		  }
		| undefined = undefined;
	export let isEditing: boolean;
	export let incrementDecrementValue: number | undefined = undefined;
	export let showIncrementDecrement: boolean = true;
	export let listType: LogListType_enum = LogListType_enum.unordered;
	export let log: Writable<MappedLog_int>;

	let onOpenDelete: () => void;

	$: dateValues = getDayMonthYearFromDate($log.date);
	$: lastUpdatedDateValues = $log.lastUpdated && getDayMonthYearFromDate($log.lastUpdated);

	const onConfirmDelete: () => void = () => {
		onDelete();
	};

	const onChangeList = () => {
		const indexOfListType = allLogListTypes.indexOf(listType);
		const nextIndex = indexOfListType + 1 > allLogListTypes.length - 1 ? 0 : indexOfListType + 1;

		listType = allLogListTypes[nextIndex];

		const nextIndexListType = allLogListTypes[nextIndex];
		const currentIndexListType = allLogListTypes[indexOfListType];

		if (nextIndexListType === LogListType_enum.checkbox) {
			$log.checkboxItems = getCheckboxItemsFromMappedListItems($log.listItems);
		} else if (currentIndexListType === LogListType_enum.checkbox) {
			$log.listItems = getListItemsFromMappedCheckboxItems($log.checkboxItems);
		}
	};

	const listIcons: Record<LogListType_enum, string> = {
		[LogListType_enum.unordered]: icons.unorderedList,
		[LogListType_enum.ordered]: icons.orderedList,
		[LogListType_enum.checkbox]: icons.checkboxList
	};

	$: buttons = [
		{
			icon: icons.delete,
			onClick: onOpenDelete,
			isHidden: !isEditing
		},
		{
			icon: icons.tick,
			onClick: onAccept,
			isHidden: !isEditing
		},
		{
			icon: icons.addList,
			onClick: onAddItem
		},
		{
			icon: listIcons[listType],
			onClick: onChangeList,
			isHidden: !isEditing || $log.type !== LogType_enum.list
		}
	];
</script>

<div class="w-full hstack">
	<div class="flex flex-wrap place-items-center gap-2">
		<Icon
			icon={logIcons[$log.type]}
			height={$log.type === LogType_enum.important ? '30px' : '25px'}
			class="text-gray-300"
		/>
		{#each buttons as { icon, isHidden, ...rest }}
			{#if !isHidden}
				<LogButton _class="w-[60px]" {...rest}>
					<Icon {icon} height="20px" class="text-gray-300" />
				</LogButton>
			{/if}
		{/each}
		{#if isEditing || (incrementDecrementProps && showIncrementDecrement && incrementDecrementValue)}
			<IncrementDecrement {...incrementDecrementProps} value={incrementDecrementValue} />
		{/if}
		<div class="stack">
			<p class="text-xs text-gray-200 text-black">
				{dateValues.hour}:{dateValues.minutes}/{dateValues.string}
			</p>
			{#if lastUpdatedDateValues}
				<p class="text-xs text-gray-300 text-black">
					{lastUpdatedDateValues?.hour}:{lastUpdatedDateValues?.minutes}/{lastUpdatedDateValues?.string}
				</p>
			{/if}
		</div>
	</div>
</div>

<ConfirmationDialog bind:onOpen={onOpenDelete} onConfirm={onConfirmDelete}
	>Are you sure you want to delete?</ConfirmationDialog
>
