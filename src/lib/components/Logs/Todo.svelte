<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
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
	import { currentlyEditing, titles } from '$lib/stores';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import { debounce } from '$lib/utils/general';
	import type { Readable } from 'svelte/motion';

	export let title: string;
	export let reference: string = '';
	export let date: Date;
	export let content: string;
	export let id: string;
	export let priority: number;
	export let isCompleted: boolean = false;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;

	let originalTitle = title;
	let originalReference = reference;
	let originalContent = content;
	let originalPriority = priority;
	let originalIsCompleted = isCompleted;

	let isEditing: Readable<boolean>;

	let onDelete: () => void;
	let onTitleAutoFill: (title: string) => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let onEdit: () => void;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;

	const onCheckboxClick = () => {
		isCompleted = !isCompleted;
		debounce(() =>
			$updateMutation.mutate({
				id,
				content,
				priority,
				date,
				type: LogType_enum.todo,
				space: $page.params.space,
				isCompleted
			})
		);
	};

	const onAccept = async () => {
		const haveValuesChanged = getHaveValuesChanged({
			values: {
				content,
				priority,
				isCompleted,
				title,
				reference
			},
			originalValues: {
				content: originalContent,
				priority: originalPriority,
				isCompleted: originalIsCompleted,
				title: originalTitle,
				reference: originalReference
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

		try {
			await $updateMutation.mutate({
				id,
				content,
				priority,
				date: logDate,
				type: LogType_enum.todo,
				space: $page.params.space,
				isCompleted,
				lastUpdated: new Date(),
				title,
				reference
			});
			onResetNewLogType && onResetNewLogType();
			originalTitle = title;
			originalReference = reference;
			originalContent = content;
			originalPriority = priority;
			originalIsCompleted = isCompleted;
		} catch (error) {}
		$currentlyEditing = null;
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		title = originalTitle;
		reference = originalReference;
		content = originalContent;
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (priority = priority + 1),
		onDecrement: () => (priority = priority - 1)
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
>
	<div class="border-dashed border-neutral-200 border p-2 sm:p-3 stack gap-4">
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
		<div class="hstack gap-4 items-center">
			<IconWithRating icon={icons.todo} rating={priority} />
			<button
				on:click={onCheckboxClick}
				class="center border-2 border-gray-300 w-[30px] h-[30px] rounded-md"
			>
				{#if isCompleted}
					<Icon icon={icons.tickBold} height="15px" class="text-green-500" />
				{/if}
			</button>
			<div class="flex-1">
				{#if $isEditing}
					<Textarea bind:value={content} autofocus={inputAutoFocus} />
				{:else}
					<p class="text-sm">{content}</p>
				{/if}
			</div>
		</div>
		<BottomOptions
			{onEdit}
			{onDelete}
			{date}
			isEditing={$isEditing}
			{onAccept}
			{incrementDecrementProps}
			incrementDecrementValue={priority}
			showIncrementDecrement={$isEditing}
			{lastUpdated}
		/>
	</div>
</LogContainer>
