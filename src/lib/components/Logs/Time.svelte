<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Dialog from '../Dialog/Dialog.svelte';
	import LogContainer from './LogContainer.svelte';
	import BottomOptions from './BottomOptions.svelte';
	import { getContext } from 'svelte';
	import { LogType_enum, type Log_int } from '$lib/types';
	import { page } from '$app/stores';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import Input from '../Input.svelte';
	import { getHaveValuesChanged } from '$lib/utils/logs';
	import { currentlyEditing, titles } from '$lib/stores';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import { debounce } from '$lib/utils/general';
	import type { Readable } from 'svelte/motion';
	import ListItems from './LogListItems.svelte';
	import toast from 'svelte-french-toast';

	export let date: Date;
	export let listItems: string[] = [];
	export let id: string;
	export let title: string = '';
	export let reference: string = '';
	export let time: number = 0;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;

	let onOpen: () => void;
	let onClose: () => void;
	let onEdit: () => void;
	let newBulletInput: HTMLInputElement;
	let onDelete: () => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let onTitleAutoFill: (title: string) => void;

	let originalListItems = [...listItems];
	let originalTitle = title;
	let originalReference = reference;
	let originalTime = time;

	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;

	let isEditing: Readable<boolean>;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onDeleteItem = (index: number) => {
		listItems = listItems.filter((_, i) => i !== index);
	};

	const onAccept = async () => {
		if (!title && !reference && !listItems.length) {
			return onOpen();
		}

		const haveValuesChanged = getHaveValuesChanged({
			values: {
				title,
				reference,
				listItems,
				time
			},
			originalValues: {
				title: originalTitle,
				reference: originalReference,
				listItems: originalListItems,
				time: originalTime
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

		listItems = listItems.filter((c) => c);
		$currentlyEditing = null;
		try {
			await $updateMutation.mutate({
				id,
				title,
				reference,
				listItems,
				time,
				date: logDate,
				type: LogType_enum.time,
				space: $page.params.space,
				lastUpdated: new Date()
			});
			originalTitle = title;
			originalReference = reference;
			originalListItems = listItems;
			originalTime = time;
			lastUpdated = new Date();
		} catch (error) {
			toast.error('There was an issue updating the log');
		}

		onResetNewLogType && onResetNewLogType();
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		listItems = originalListItems;
		title = originalTitle;
		reference = originalReference;
	};

	const onAddItem = () => {
		$currentlyEditing = id;
		listItems = [...listItems, ''];
	};

	const onAcceptNewBullet = () => {
		newBulletInput.value = '';
	};

	const onIncrement = () => {
		time = time + 0.5;
		debounce(() =>
			$updateMutation.mutate({
				id,
				title,
				reference,
				listItems,
				time,
				date,
				type: LogType_enum.time,
				space: $page.params.space
			})
		);
	};

	const onDecrement = () => {
		time = time - 0.5;
		debounce(() =>
			$updateMutation.mutate({
				id,
				title,
				reference,
				listItems,
				time,
				date,
				type: LogType_enum.time,
				space: $page.params.space
			})
		);
	};

	const incrementDecrementProps = {
		min: 0,
		max: 24,
		onIncrement,
		onDecrement
	};
	const onTextareaEnterKeydown: () => void = () => {
		onAddItem();
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
	<div class="bg-neutral-100 p-2 rounded-sm">
		<div class="bg-white rounded-sm p-2 stack text-sm gap-1">
			{#if title || reference || $isEditing}
				<div class="stack gap-1">
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
					{#if $isEditing || reference}
						<Input
							bind:value={reference}
							bind:changeInputValue={changeReferenceInputValue}
							placeholder="Reference"
							isDisabled={!$isEditing}
						/>
					{/if}
				</div>
			{/if}
			<ListItems
				items={listItems}
				{isEditing}
				onEnterKeydown={onTextareaEnterKeydown}
				{onDeleteItem}
			/>
			<div class="hstack mt-2">
				<BottomOptions
					{incrementDecrementProps}
					incrementDecrementValue={time}
					{date}
					isEditing={$isEditing}
					onAccept={$isEditing ? onAccept : onAcceptNewBullet}
					{onAddItem}
					{onEdit}
					{onDelete}
					icon={icons.clock}
					{lastUpdated}
				/>
			</div>
		</div>
	</div>
</LogContainer>

<Dialog bind:onOpen bind:onClose>
	<div>
		<p>You must have a title and reference to save a log.</p>
		<button on:click={onClose}>Close</button>
	</div>
</Dialog>
