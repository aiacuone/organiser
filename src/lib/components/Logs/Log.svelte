<script lang="ts">
	import {
		Log_enum,
		LogType_enum,
		type BaseMappedListItem_int,
		type CheckboxItem_int,
		type QuestionItem_int,
		type ListItem_int,
		type Log_int
	} from '$lib/types';
	import {
		clickOutside,
		debounce,
		getCheckboxItemsFromMappedCheckboxItems,
		getDateFromHyphenatedString,
		getHaveValuesChanged,
		getHyphenatedStringFromDate,
		getListItemsFromMappedListItems,
		getQuestionsFromMappedQuestions
	} from '$lib/utils';
	import { page } from '$app/stores';

	import { getContext, onMount } from 'svelte';
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import toast from 'svelte-french-toast';
	import { derived } from 'svelte/store';
	import { isDropdownOpen } from '$lib/stores';
	import { currentlyEditing, titlesAndReferences, titles } from '$lib/stores';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import Input from '../Input.svelte';
	import BottomOptions from './BottomOptions.svelte';
	import ListItems from './LogListItems.svelte';
	import CheckboxItems from './LogCheckboxItems.svelte';
	import LogQuestionItems from './LogQuestionItems.svelte';
	import { useMutation } from '@sveltestack/svelte-query';

	export let logType: LogType_enum;
	export let title: string = '';
	export let reference: string = '';
	export let date: Date;
	export let id: string;
	export let rating: 1 | 2 | 3 = 1;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;
	export let checkboxItems: (BaseMappedListItem_int & CheckboxItem_int)[] = [];
	export let questions: (BaseMappedListItem_int & QuestionItem_int)[] = [];
	export let listItems: (BaseMappedListItem_int & ListItem_int)[] = [];
	export let inputAutoFocus: boolean = false;
	export let time: number = 0;

	let originalTitle = title;
	let originalReference = reference;
	let originalRating = rating;
	let originalCheckboxItems = checkboxItems;
	let originalQuestions = questions;
	let originalListItems = listItems;
	let originalTime = time;

	let isAnswering: undefined | number = undefined;
	let container: HTMLDivElement;

	const invalidateLogs: () => void = getContext('invalidateLogs');
	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	export const isEditing = derived(
		[currentlyEditing],
		([$currentlyEditing]) => $currentlyEditing === id
	);

	const updateLogMutation = useMutation(updateLog, {
		onSuccess: () => {
			invalidateLogs();
		}
	});

	const deleteLogMutation = useMutation(deleteLog, {
		onSuccess: () => {
			invalidateLogs();
		}
	});

	export const onDelete = () => {
		$currentlyEditing = null;
		$deleteLogMutation.mutate(id);
	};

	const onEdit = () => {
		const isAnotherCardEditing = !!$currentlyEditing;
		if (!isAnotherCardEditing) {
			$currentlyEditing = id;
		}
	};

	export const onResetItems: () => void = () => {
		isAnswering = undefined;
	};

	let changeReferenceInputValue: ((value: string | undefined) => void) | undefined = undefined;

	const onTitleAutoFill = (_title: string) => {
		const correspondingReference = $titlesAndReferences.find((t) => t.title === _title)?.reference;

		changeReferenceInputValue && changeReferenceInputValue(correspondingReference ?? undefined);
	};

	let onFocusAnswerInput: () => void;
	const _onFocusAnswerInput = () => {
		$currentlyEditing = id;
		//this is a hack to make sure the answer input is focused
		setTimeout(() => {
			onFocusAnswerInput();
		}, 0);
	};

	const onAccept = async () => {
		const values: Log_int = {
			[Log_enum.id]: id,
			[Log_enum.date]: date,
			[Log_enum.type]: logType,
			[Log_enum.space]: $page.params.space,
			[Log_enum.lastUpdated]: new Date(),
			[Log_enum.rating]: rating,
			[Log_enum.title]: title,
			[Log_enum.reference]: reference
		};

		const originalValues: Partial<Log_int> = {
			[Log_enum.rating]: originalRating,
			[Log_enum.title]: originalTitle,
			[Log_enum.reference]: originalReference
		};

		if (logType === LogType_enum.todo) {
			const filteredCheckboxItems = checkboxItems.filter(({ text }) => text);
			values[Log_enum.checkboxItems] =
				getCheckboxItemsFromMappedCheckboxItems(filteredCheckboxItems);
			originalCheckboxItems = [...filteredCheckboxItems];
		} else if (logType === LogType_enum.question) {
			const filteredQuestions = questions.filter(
				({ question, answer }) => question || (answer && question)
			);
			values[Log_enum.questions] = getQuestionsFromMappedQuestions(filteredQuestions);
			originalQuestions = [...filteredQuestions];
		} else if (logType === LogType_enum.important || logType === LogType_enum.time) {
			const filteredListItems = listItems.filter(({ item }) => item);
			values[Log_enum.listItems] = getListItemsFromMappedListItems(filteredListItems);
			values[Log_enum.time] = time;
			originalListItems = [...filteredListItems];
		}

		const haveValuesChanged = getHaveValuesChanged({
			values,
			originalValues
		});

		if (!haveValuesChanged) return ($currentlyEditing = null);

		if ($page.params.date && $page.params.date !== getHyphenatedStringFromDate(date)) {
			const currentDate = new Date();
			const _date = new Date(getDateFromHyphenatedString($page.params.date));
			_date.setHours(currentDate.getHours());
			_date.setMinutes(currentDate.getMinutes());
			values[Log_enum.date] = _date;
		}

		try {
			await $updateLogMutation.mutate(values);
		} catch (error) {
			toast.error('Issue updating state');
		}

		onResetNewLogType && onResetNewLogType();
		originalTitle = title;
		originalReference = reference;
		originalRating = rating;
		$currentlyEditing = null;

		if (logType === LogType_enum.todo) {
			originalCheckboxItems = [...checkboxItems];
		} else if (logType === LogType_enum.question) {
			originalQuestions = [...questions];
			onResetItems();
		} else if (logType === LogType_enum.important) {
			originalListItems = [...listItems];
		} else if (logType === LogType_enum.time) {
			originalListItems = [...listItems];
			originalTime = time;
		}
	};

	const onAddItem = () => {
		$currentlyEditing = id;
		if (logType === LogType_enum.todo) {
			checkboxItems = [...checkboxItems, { id: checkboxItems.length, isChecked: false, text: '' }];
		} else if (logType === LogType_enum.question) {
			questions = [...questions, { id: questions.length, question: '' }];
		} else if (logType === LogType_enum.important || logType === LogType_enum.time) {
			listItems = [...listItems, { id: listItems.length, item: '' }];
		}
	};

	const onDeleteItem = (index: number) => {
		if (logType === LogType_enum.todo) {
			checkboxItems = checkboxItems.filter((_, i) => i !== index);
		} else if (logType === LogType_enum.question) {
			questions = questions.filter((_, i) => i !== index);
		} else if (logType === LogType_enum.important || logType === LogType_enum.time) {
			listItems = listItems.filter((_, i) => i !== index);
		}
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		listItems = originalListItems;
		title = originalTitle;
		reference = originalReference;
	};

	const onTextareaEnterKeydown: () => void = () => {
		onAddItem();
	};

	onMount(() => {
		const keydown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
				onAccept();
			}
			if (e.ctrlKey && e.shiftKey && e.key === '.') {
				onAddItem();
			}
		};

		container.addEventListener('keydown', keydown);

		return () => {
			container.removeEventListener('keydown', keydown);
		};
	});

	onMount(() => {
		if (editOnMount) {
			$currentlyEditing = id;
		}
	});

	let onOpen: () => void;
	// let onClose: () => void;
	let isOpen: boolean;

	const onClickOutside = () => {
		$isEditing && !isOpen && !$isDropdownOpen && onOpen();
	};

	const incrementDecrementPropValues: Record<LogType_enum, { min: number; max: number }> = {
		[LogType_enum.todo]: { min: 0, max: 3 },
		[LogType_enum.question]: { min: 1, max: 3 },
		[LogType_enum.important]: { min: 0, max: 3 },
		[LogType_enum.list]: { min: 0, max: 3 },
		[LogType_enum.time]: { min: 0, max: 24 }
	};

	const onIncrement = () => {
		if (logType === LogType_enum.time) {
			time = time + 0.5;
			if (!$isEditing) {
				debounce(() =>
					$updateLogMutation.mutate({
						id,
						title,
						reference,
						listItems: getListItemsFromMappedListItems(listItems),
						time,
						date,
						type: LogType_enum.time,
						space: $page.params.space
					})
				);
			}
		} else {
			rating = rating + 1;
		}
	};

	const onDecrement = () => {
		if (logType === LogType_enum.time) {
			time = time - 0.5;
			if (!$isEditing) {
				debounce(() =>
					$updateLogMutation.mutate({
						id,
						title,
						reference,
						listItems: getListItemsFromMappedListItems(listItems),
						time,
						date,
						type: LogType_enum.time,
						space: $page.params.space
					})
				);
			}
		} else {
			rating = rating - 1;
		}
	};

	const containerClasses: Record<LogType_enum, string[]> = {
		[LogType_enum.todo]: ['', 'border-dashed border-neutral-200 border p-2 stack gap-1'],
		[LogType_enum.question]: [
			'bg-neutral-100 p-1 rounded-sm',
			'bg-white p-2 stack gap-3 rounded-sm'
		],
		[LogType_enum.time]: [
			'bg-neutral-100 p-2 rounded-sm',
			'bg-white rounded-sm p-2 stack text-sm gap-1'
		],
		[LogType_enum.important]: ['', 'bg-neutral-50 p-2 stack gap-1 text-sm'],
		[LogType_enum.list]: ['', 'bg-neutral-50 p-2 stack gap-1 text-sm']
	};
</script>

<div bind:this={container} use:clickOutside on:click_outside={onClickOutside} class="">
	<div class={containerClasses[logType][0]}>
		<div class={containerClasses[logType][1]}>
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
			<div class="hstack center gap-2">
				{#if logType === LogType_enum.todo}
					<div class="flex-1">
						<CheckboxItems
							bind:checkboxes={checkboxItems}
							{isEditing}
							onEnterKeydown={onTextareaEnterKeydown}
							onDeleteBullet={onDeleteItem}
							{onEdit}
						/>
					</div>
				{/if}
				{#if logType === LogType_enum.question}
					<LogQuestionItems
						bind:questions
						onFocusAnswerInput={_onFocusAnswerInput}
						isDisabled={!$isEditing}
						{isEditing}
						onDeleteQuestion={onDeleteItem}
						{id}
					/>
				{/if}
				{#if logType === LogType_enum.important || logType === LogType_enum.time}
					<ListItems
						bind:items={listItems}
						{isEditing}
						onEnterKeydown={onTextareaEnterKeydown}
						{onDeleteItem}
					/>
				{/if}
			</div>
			<BottomOptions
				incrementDecrementProps={{
					min: incrementDecrementPropValues[logType].min,
					max: incrementDecrementPropValues[logType].max,
					onIncrement,
					onDecrement
				}}
				incrementDecrementValue={logType === LogType_enum.time ? time : rating}
				{date}
				isEditing={$isEditing}
				{onAccept}
				{onAddItem}
				{onEdit}
				{onDelete}
				{lastUpdated}
				{logType}
			/>
		</div>
	</div>
</div>

<ConfirmationDialog onConfirm={onResetChange} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
