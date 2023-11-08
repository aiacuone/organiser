<script lang="ts">
	import { icons } from '$lib/general/icons';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	import Textarea from '../Textarea.svelte';
	import { getContext } from 'svelte';
	import { LogType_enum, type Log_int } from '$lib/types';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import { page } from '$app/stores';
	import { getHaveValuesChanged } from '$lib/utils/logs';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';
	import Input from '../Input.svelte';
	import { titles } from '$lib/stores';
	import Dialog from '../Dialog.svelte';
	import Button from '../Button.svelte';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';

	export let title: string;
	export let reference: string = '';
	export let date: Date;
	export let content: string;
	export let id: string;
	export let importance: number;
	export let isEditing: boolean = false;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;

	let originalTitle = title;
	let originalReference = reference;
	let originalContent = content;
	let originalImportance = importance;

	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;
	let onEdit: () => void;
	let onDelete: () => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let onTitleAutoFill: (title: string) => void;

	let onOpen: () => void;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onAccept = () => {
		if (!content) {
			return onOpen();
		}

		const haveValuesChanged = getHaveValuesChanged({
			values: {
				title,
				reference,
				content,
				importance
			},
			originalValues: {
				title: originalTitle,
				reference: originalReference,
				content: originalContent,
				importance: originalImportance
			}
		});

		isEditing = false;

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
			content,
			importance,
			date: logDate,
			type: LogType_enum.important,
			space: $page.params.space,
			lastUpdated: new Date()
		});
		originalTitle = title;
		originalReference = reference;
		originalContent = content;
		originalImportance = importance;

		onResetNewLogType && onResetNewLogType();
	};

	const onResetChange = () => {
		isEditing = false;
		onResetNewLogType && onResetNewLogType();
		content = originalContent;
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (importance = importance + 1),
		onDecrement: () => (importance = importance - 1)
	};

	let isOpen: boolean;
	let onClose: () => void;
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
>
	<div class="bg-neutral-50 p-2 sm:p-3 stack gap-3">
		{#if title || reference || isEditing}
			<div class="stack">
				{#if !isEditing && !title}{''}{:else}
					<Input
						bind:value={title}
						autofocus={inputAutoFocus}
						placeholder="Title"
						autofillValues={$titles}
						isDisabled={!isEditing}
						onAutoFill={onTitleAutoFill}
					/>
				{/if}
				{#if !isEditing && !reference}{''}{:else}
					<Input
						bind:value={reference}
						placeholder="Reference"
						isDisabled={!isEditing}
						bind:changeInputValue={changeReferenceInputValue}
					/>
				{/if}
			</div>
		{/if}
		<div class="hstack center gap-2">
			<IconWithRating rating={importance} icon={icons.important} />
			<div class="flex-1">
				{#if isEditing}
					<Textarea bind:value={content} autofocus={inputAutoFocus} />
				{:else}
					<p class="text-sm">
						{content}
					</p>
				{/if}
			</div>
		</div>
		<BottomOptions
			{onEdit}
			{onDelete}
			{date}
			{isEditing}
			{onAccept}
			{incrementDecrementProps}
			incrementDecrementValue={importance}
			showIncrementDecrement={isEditing}
			{lastUpdated}
		/>
	</div>
</LogContainer>

<Dialog bind:onOpen bind:isOpen bind:onClose>
	<div class="stack center gap-1">
		Please add some content to your log.
		<Button onClick={onClose}>OK</Button>
	</div>
</Dialog>
