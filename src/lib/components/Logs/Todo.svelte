<script lang="ts">
	import { icons } from '$lib/general/icons';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	import { getContext } from 'svelte';
	import { LogType_enum, Log_enum, type Log_int, type CheckboxItem_int } from '$lib/types';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import { page } from '$app/stores';
	import {
		getCheckboxItemsFromMappedCheckboxItems,
		getHaveValuesChanged,
		getMappedCheckboxItems
	} from '$lib/utils/logs';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';
	import Input from '../Input.svelte';
	import { currentlyEditing, titles } from '$lib/stores';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import type { Readable } from 'svelte/motion';
	import toast from 'svelte-french-toast';
	import CheckboxItems from './LogCheckboxItems.svelte';
	import { writable } from 'svelte/store';

	export let title: string = '';
	export let reference: string = '';
	export let date: Date;
	export let id: string;
	export let rating: 1 | 2 | 3;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;
	export let checkboxItems: CheckboxItem_int[] = [];

	const mappedCheckboxItems = writable(getMappedCheckboxItems(checkboxItems));
	let mappedOriginalcheckboxItems = getMappedCheckboxItems(checkboxItems);

	let originalTitle = title;
	let originalReference = reference;
	let originalRating = rating;
	let originalCheckboxItems = [...mappedOriginalcheckboxItems];

	let isEditing: Readable<boolean>;

	let onDelete: () => void;
	let onTitleAutoFill: (title: string) => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let onEdit: () => void;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;

	const onAccept = async () => {
		const haveValuesChanged = getHaveValuesChanged({
			values: {
				[Log_enum.rating]: rating,
				[Log_enum.title]: title,
				[Log_enum.reference]: reference,
				[Log_enum.checkboxItems]: $mappedCheckboxItems
			},
			originalValues: {
				[Log_enum.rating]: originalRating,
				[Log_enum.title]: originalTitle,
				[Log_enum.reference]: originalReference,
				[Log_enum.checkboxItems]: originalCheckboxItems
			}
		});

		if (!haveValuesChanged) return ($currentlyEditing = null);

		let logDate: Date = date;

		if ($page.params.date && $page.params.date !== getHyphenatedStringFromDate(date)) {
			const currentDate = new Date();
			const _date = new Date(getDateFromHyphenatedString($page.params.date));
			_date.setHours(currentDate.getHours());
			_date.setMinutes(currentDate.getMinutes());
			logDate = _date;
		}

		$mappedCheckboxItems = $mappedCheckboxItems.filter(({ text }) => text);

		try {
			await $updateMutation.mutate({
				id,
				rating,
				date: logDate,
				type: LogType_enum.todo,
				space: $page.params.space,
				lastUpdated: new Date(),
				title,
				reference,
				checkboxItems: getCheckboxItemsFromMappedCheckboxItems($mappedCheckboxItems)
			});
			onResetNewLogType && onResetNewLogType();
			originalTitle = title;
			originalReference = reference;
			originalRating = rating;
			originalCheckboxItems = [...$mappedCheckboxItems];
		} catch (error) {
			toast.error('Issue updating state');
		}
		$currentlyEditing = null;
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		title = originalTitle;
		reference = originalReference;
		rating = originalRating;
		$mappedCheckboxItems = [...originalCheckboxItems];
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (rating = rating + 1),
		onDecrement: () => (rating = rating - 1)
	};

	const onAddItem = () => {
		$currentlyEditing = id;
		$mappedCheckboxItems = [
			...$mappedCheckboxItems,
			{ id: $mappedCheckboxItems.length, isChecked: false, text: '' }
		];
	};

	const onTextareaEnterKeydown: () => void = () => {
		onAddItem();
	};

	const onDeleteBullet = (index: number) => {
		$mappedCheckboxItems = [...$mappedCheckboxItems].filter((_, i) => i !== index);
	};
</script>

<LogContainer
	bind:onEdit
	onConfirmReset={onResetChange}
	bind:updateLogMutation={updateMutation}
	bind:deleteLogMutation={deleteMutation}
	bind:onDelete
	{id}
	bind:onTitleAutoFill
	bind:isEditing
	{changeReferenceInputValue}
	{editOnMount}
	onControlShitAndDotKeydown={onAddItem}
	onControlShitAndEnterKeydown={onAccept}
>
	<div class="border-dashed border-neutral-200 border p-2 sm:p-3 stack gap-1">
		{#if title || reference || $isEditing}
			<div class="stack gap-1">
				{#if !$isEditing && !title}{''}{:else}
					<Input
						bind:value={title}
						autofocus={true}
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
		<div class="hstack items-center">
			<IconWithRating icon={icons.todo} {rating} />
			<div class="flex-1">
				<CheckboxItems
					checkboxes={mappedCheckboxItems}
					{isEditing}
					onEnterKeydown={onTextareaEnterKeydown}
					{onDeleteBullet}
					{onEdit}
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
