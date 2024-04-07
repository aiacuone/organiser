<script lang="ts">
	import { LogType_enum, LogListType_enum, type MappedLog_int, type Log_int } from '$lib/types';
	import {
		clickOutside,
		debounce,
		getDateFromHyphenatedString,
		getHyphenatedStringFromDate,
		getListItemsFromMappedListItems,
		getLogFromMappedLog,
		getMappedLog,
		addToEndOfRaceCondition
	} from '$lib/utils';
	import { page } from '$app/stores';
	import { getContext, onMount, setContext } from 'svelte';
	import { deleteLogClient, updateLogClient } from '$lib/api/logsLocalApi';
	import toast from 'svelte-french-toast';
	import { derived, writable, type Writable } from 'svelte/store';
	import { isDropdownOpen } from '$lib/stores';
	import { currentlyEditing, titlesAndReferences, titles } from '$lib/stores';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import Input from '../Input.svelte';
	import BottomOptions from './BottomOptions.svelte';
	import ListItems from './LogListItems.svelte';
	import CheckboxItems from './LogCheckboxItems.svelte';
	import LogQuestionItems from './LogQuestionItems.svelte';
	import { useMutation } from '@sveltestack/svelte-query';
	import isEqual from 'lodash.isequal';

	export let initialLog: Log_int;
	const log: Writable<MappedLog_int> = writable(getMappedLog(initialLog));
	$: initialLog, ($log = getMappedLog(initialLog));

	export let editOnMount: boolean = false;
	export let inputAutoFocus: boolean = false;

	let container: HTMLButtonElement;

	const onEditLog = () => {
		$currentlyEditing = $log.id;
	};

	const onStopEditing = () => {
		$currentlyEditing = null;
	};

	const invalidateLogs: () => void = getContext('invalidateLogs');
	const onResetNewLogType: () => void = getContext('onResetNewLogType');
	setContext('onEditLog', onEditLog);

	const isEditing = derived(
		[currentlyEditing],
		([$currentlyEditing]) => $currentlyEditing === $log.id
	);
	setContext('isEditing', isEditing);

	const updateLogMutation = useMutation(updateLogClient, {
		onSuccess: () => {
			invalidateLogs();
		}
	});

	const deleteLogMutation = useMutation(deleteLogClient, {
		onSuccess: () => {
			invalidateLogs();
		}
	});

	const onDelete = () => {
		$deleteLogMutation.mutate($log.id);
		addToEndOfRaceCondition(onStopEditing);
	};

	const onEdit = () => {
		const isAnotherCardEditing = !!$currentlyEditing;
		if (!isAnotherCardEditing) {
			onEditLog();
		}
	};

	let changeReferenceInputValue: ((value: string | undefined) => void) | undefined = undefined;

	const onTitleAutoFill = (_title: string) => {
		const correspondingReference = $titlesAndReferences.find((t) => t.title === _title)?.reference;

		changeReferenceInputValue && changeReferenceInputValue(correspondingReference ?? undefined);
	};

	let onFocusAnswerInput: () => void;
	const _onFocusAnswerInput = () => {
		onEditLog();
		addToEndOfRaceCondition(onFocusAnswerInput);
	};

	const getHaveValuesChanged = () => {
		const haveValuesChanged = !isEqual(getLogFromMappedLog($log), initialLog);

		return haveValuesChanged;
	};

	const onAccept = async () => {
		const haveValuesChanged = getHaveValuesChanged();

		if (!haveValuesChanged) return onStopEditing();

		if ($page.params.date && $page.params.date !== getHyphenatedStringFromDate($log.date)) {
			const currentDate = new Date();
			const _date = new Date(getDateFromHyphenatedString($page.params.date));
			_date.setHours(currentDate.getHours());
			_date.setMinutes(currentDate.getMinutes());
			$log.date = _date;
		}

		const updatedLog: Log_int = getLogFromMappedLog($log);

		try {
			await $updateLogMutation.mutate(updatedLog);
		} catch (error) {
			toast.error('Issue updating state');
		}

		onResetNewLogType && onResetNewLogType();
		initialLog = updatedLog;
		addToEndOfRaceCondition(onStopEditing);
	};

	const focusElements: Writable<HTMLElement[]> = writable([]);

	const onAddItem = () => {
		onEditLog();

		const addListItem = () =>
			$log.listItems &&
			($log.listItems = [...$log.listItems, { id: $log.listItems.length, item: '' }]);

		const addCheckboxItem = () =>
			$log.checkboxItems &&
			($log.checkboxItems = [
				...$log.checkboxItems,
				{ id: $log.checkboxItems.length, isChecked: false, text: '' }
			]);

		const addQuestionItem = () =>
			$log.questions &&
			($log.questions = [
				...$log.questions,
				{ id: $log.questions.length, question: '', answer: '' }
			]);

		const addItemTypeMethods: Record<LogType_enum, () => void> = {
			[LogType_enum.todo]: () => {
				addCheckboxItem();
			},
			[LogType_enum.question]: () => {
				addQuestionItem();
			},
			[LogType_enum.important]: addListItem,
			[LogType_enum.time]: addListItem,
			[LogType_enum.list]: () => {
				if ($log.listType === LogListType_enum.checkbox) addCheckboxItem();
				else addListItem();
			}
		};
		addItemTypeMethods[$log.type]();

		$focusElements = [...$focusElements, $focusElements[$focusElements.length - 1]];
	};

	const onDeleteItem = (index: number) => {
		const removeListItem = () =>
			$log.listItems && ($log.listItems = $log.listItems.filter((_, i) => i !== index));

		const removeCheckboxItem = () =>
			$log.checkboxItems && ($log.checkboxItems = $log.checkboxItems.filter((_, i) => i !== index));
		const removeQuestionItem = () =>
			$log.questions && ($log.questions = $log.questions.filter((_, i) => i !== index));

		const removeItemTypeMethods: Record<LogType_enum, () => void> = {
			[LogType_enum.todo]: () => {
				removeCheckboxItem();
			},
			[LogType_enum.question]: () => {
				removeQuestionItem();
			},
			[LogType_enum.important]: removeListItem,
			[LogType_enum.time]: removeListItem,
			[LogType_enum.list]: () => {
				if ($log.listType === LogListType_enum.checkbox) removeCheckboxItem();
				else removeListItem();
			}
		};
		removeItemTypeMethods[$log.type]();
		$focusElements = $focusElements.filter((_, i) => i !== index + 2);
	};

	const onResetChange = () => {
		onResetNewLogType && onResetNewLogType();
		$log = getMappedLog(initialLog);

		onStopEditing();
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
			onEditLog();
		}
	});

	let onOpen: () => void;
	let isOpen: boolean;

	const onClickOutside = () => {
		if ($isEditing) {
			const haveValuesChanged = getHaveValuesChanged();
			if (haveValuesChanged && !isOpen && !$isDropdownOpen) {
				onOpen();
			} else {
				onStopEditing();
			}
		}
	};

	const incrementDecrementPropValues: Record<LogType_enum, { min: number; max: number }> = {
		[LogType_enum.todo]: { min: 0, max: 3 },
		[LogType_enum.question]: { min: 1, max: 3 },
		[LogType_enum.important]: { min: 0, max: 3 },
		[LogType_enum.list]: { min: 0, max: 3 },
		[LogType_enum.time]: { min: 0, max: 24 }
	};

	const onIncrement = () => {
		if ($log.type === LogType_enum.time) {
			$log.time = $log.time + 0.5;

			if (!$isEditing) {
				debounce(() =>
					$updateLogMutation.mutate({
						...$log,
						listItems: getListItemsFromMappedListItems($log.listItems)
					})
				);
			}
		} else {
			$log.rating = ($log.rating + 1) as 1 | 2 | 3;
		}
	};

	const onDecrement = () => {
		if ($log.type === LogType_enum.time) {
			$log.time = $log.time - 0.5;
			if (!$isEditing) {
				debounce(() =>
					$updateLogMutation.mutate({
						...$log,
						listItems: getListItemsFromMappedListItems($log.listItems)
					})
				);
			}
		} else {
			$log.rating = ($log.rating - 1) as 1 | 2 | 3;
		}
	};

	const containerClasses: Record<LogType_enum, string[]> = {
		[LogType_enum.todo]: ['', 'border-dashed border-neutral-200 border p-2 gap-1'],
		[LogType_enum.question]: ['bg-neutral-100 p-1 rounded-sm', 'bg-white p-2 rounded-sm'],
		[LogType_enum.time]: ['p-1', 'shadow-md bg-white rounded-sm p-2 text-sm gap-1'],
		[LogType_enum.important]: ['', 'bg-neutral-50 p-2 gap-1 text-sm'],
		[LogType_enum.list]: ['', 'p-2 gap-1 text-sm border border-neutral-200 rounded-lg']
	};

	const onClickLog = () => {
		if ($currentlyEditing) return;
		onEditLog();
	};

	const onContainerKeypress = (e: KeyboardEvent) => {
		if (!$isEditing) return;

		const indexOfFocusedElement = $focusElements.indexOf(e.target as HTMLElement);
		let indexOfNewFocusedElement: number = -1;

		if (e.key === 'ArrowUp') {
			if (indexOfFocusedElement === 0) {
				indexOfNewFocusedElement = $focusElements.length - 1;
			} else {
				indexOfNewFocusedElement = indexOfFocusedElement - 1;
			}
		}

		if (e.key === 'ArrowDown') {
			if (indexOfFocusedElement === $focusElements.length - 1) {
				indexOfNewFocusedElement = 0;
			} else {
				indexOfNewFocusedElement = indexOfFocusedElement + 1;
			}
		}

		$focusElements[indexOfNewFocusedElement].focus();
	};
</script>

<button
	use:clickOutside
	on:click_outside={onClickOutside}
	class=""
	on:click={onClickLog}
	on:keydown={onContainerKeypress}
	bind:this={container}
>
	<div class={containerClasses[$log.type][0]}>
		<div class="stack {containerClasses[$log.type][1]}">
			<div class={$log.title || $log.reference || $isEditing ? 'flex' : 'hidden'}>
				<div class="stack gap-1 w-full">
					<Input
						bind:value={$log.title}
						autofocus={inputAutoFocus}
						placeholder="Title"
						autofillValues={$titles}
						isDisabled={!$isEditing}
						onAutoFill={onTitleAutoFill}
						_class={!$isEditing && !$log.title ? 'hidden' : 'flex'}
						bind:input={$focusElements[0]}
					/>
					<Input
						bind:value={$log.reference}
						bind:changeInputValue={changeReferenceInputValue}
						placeholder="Reference"
						isDisabled={!$isEditing}
						_class={!$isEditing && !$log.reference ? 'hidden' : 'flex'}
						bind:input={$focusElements[1]}
					/>
				</div>
			</div>
			<div class="hstack center gap-2">
				{#if $log.type === LogType_enum.todo || ($log.type === LogType_enum.list && $log.listType === LogListType_enum.checkbox)}
					<div class="flex-1">
						<CheckboxItems
							bind:checkboxes={$log.checkboxItems}
							{isEditing}
							onEnterKeydown={onTextareaEnterKeydown}
							onDeleteBullet={onDeleteItem}
							{onEdit}
							{focusElements}
						/>
					</div>
				{:else if $log.type === LogType_enum.question}
					<LogQuestionItems
						bind:questions={$log.questions}
						onFocusAnswerInput={_onFocusAnswerInput}
						{isEditing}
						onDeleteQuestion={onDeleteItem}
						id={$log.id}
						{focusElements}
					/>
				{:else if $log.type === LogType_enum.important || $log.type === LogType_enum.time || ($log.type === LogType_enum.list && $log.listType !== LogListType_enum.checkbox)}
					<ListItems
						bind:items={$log.listItems}
						bind:listType={$log.listType}
						{isEditing}
						onEnterKeydown={onTextareaEnterKeydown}
						{onDeleteItem}
						logType={$log.type}
						{focusElements}
					/>
				{/if}
			</div>
			<BottomOptions
				incrementDecrementProps={{
					min: incrementDecrementPropValues[$log.type].min,
					max: incrementDecrementPropValues[$log.type].max,
					onIncrement,
					onDecrement
				}}
				incrementDecrementValue={$log.type === LogType_enum.time ? $log.time : $log.rating}
				isEditing={$isEditing}
				{onAccept}
				{onAddItem}
				{onDelete}
				{log}
			/>
		</div>
	</div>
</button>

<ConfirmationDialog onConfirm={onResetChange} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
