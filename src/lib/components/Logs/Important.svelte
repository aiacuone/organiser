<script lang="ts">
	import { icons } from '$lib/general/icons';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	import { getContext } from 'svelte';
	import {
		LogType_enum,
		type BaseMappedListItem_int,
		type Log_int,
		type ListItem_int
	} from '$lib/types';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import { page } from '$app/stores';
	import {
		getHaveValuesChanged,
		getListItemsFromMappedListItems,
		getMappedListItems
	} from '$lib/utils/logs';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';
	import Input from '../Input.svelte';
	import { currentlyEditing, titles } from '$lib/stores';
	import Dialog from '../Dialog/Dialog.svelte';
	import Button from '../Button.svelte';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import type { Readable } from 'svelte/motion';
	import ListItems from './LogListItems.svelte';

	export let title: string = '';
	export let reference: string = '';
	export let date: Date;
	export let id: string;
	export let rating: 1 | 2 | 3;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;
	export let listItems: (BaseMappedListItem_int & ListItem_int)[];

	let originalListItems = listItems;
	let originalTitle = title;
	let originalReference = reference;
	let originalRating = rating;

	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;
	let onEdit: () => void;
	let onDelete: () => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let onTitleAutoFill: (title: string) => void;

	let isEditing: Readable<boolean>;

	let onOpen: () => void;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onAccept = () => {
		const filteredListItems = listItems.filter(({ item }) => item !== '');
		if (!filteredListItems.length) {
			return onOpen();
		}

		const haveValuesChanged = getHaveValuesChanged({
			values: {
				title,
				reference,
				rating,
				listItems
			},
			originalValues: {
				title: originalTitle,
				reference: originalReference,
				rating: originalRating,
				listItems: originalListItems
			}
		});

		$currentlyEditing = null;

		if (!haveValuesChanged) return;

		let logDate: Date = date;
		if ($page.params.date && $page.params.date !== getHyphenatedStringFromDate(date)) {
			const currentDate = new Date();
			const _date = new Date(getDateFromHyphenatedString($page.params.date));
			_date.setHours(currentDate.getHours());
			_date.setMinutes(currentDate.getMinutes());
			logDate = _date;
		}

		$updateMutation.mutate({
			id,
			title,
			reference,
			rating,
			listItems: getListItemsFromMappedListItems(filteredListItems),
			date: logDate,
			type: LogType_enum.important,
			space: $page.params.space,
			lastUpdated: new Date()
		});
		originalTitle = title;
		originalReference = reference;
		originalRating = rating;
		originalListItems = [...listItems];
		onResetNewLogType && onResetNewLogType();
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		listItems = originalListItems;
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (rating = rating + 1),
		onDecrement: () => (rating = rating - 1)
	};

	let isOpen: boolean;
	let onClose: () => void;

	const onAddItem = () => {
		$currentlyEditing = id;
		listItems = [...listItems, { item: '', id: listItems.length }];
	};

	const onTextareaEnterKeydown: () => void = () => {
		onAddItem();
	};

	const onDeleteItem = (index: number) => {
		listItems = listItems.filter((_, i) => i !== index);
	};
</script>

<LogContainer
	bind:isEditing
	bind:onEdit
	onConfirmReset={onResetChange}
	bind:updateLogMutation={updateMutation}
	bind:deleteLogMutation={deleteMutation}
	bind:onDelete
	{id}
	showDialog={!isOpen}
	{editOnMount}
	onControlShitAndDotKeydown={onAddItem}
	onControlShitAndEnterKeydown={onAccept}
>
	<div class="bg-neutral-50 p-2 sm:p-3 stack gap-3">
		{#if title || reference || $isEditing}
			<div class="stack">
				{#if !$isEditing && !title}{''}{:else}
					<Input
						bind:value={title}
						autofocus={inputAutoFocus}
						placeholder="Title"
						autofillValues={$titles}
						isDisabled={!$isEditing}
						onAutoFill={onTitleAutoFill}
					/>
				{/if}
				{#if !$isEditing && !reference}{''}{:else}
					<Input
						bind:value={reference}
						placeholder="Reference"
						isDisabled={!$isEditing}
						bind:changeInputValue={changeReferenceInputValue}
					/>
				{/if}
			</div>
		{/if}
		<div class="hstack center gap-2">
			<IconWithRating {rating} icon={icons.important} />
			<div class="flex-1">
				<ListItems
					bind:items={listItems}
					{isEditing}
					onEnterKeydown={onTextareaEnterKeydown}
					{onDeleteItem}
				/>
			</div>
		</div>
		<BottomOptions
			{onEdit}
			{onDelete}
			{date}
			isEditing={$isEditing}
			{onAccept}
			{incrementDecrementProps}
			incrementDecrementValue={rating}
			showIncrementDecrement={$isEditing}
			{lastUpdated}
			{onAddItem}
		/>
	</div>
</LogContainer>

<Dialog bind:onOpen bind:isOpen bind:onClose>
	<div class="stack center gap-1">
		Please add some content to your log.
		<Button onClick={onClose}>OK</Button>
	</div>
</Dialog>
