<script lang="ts">
	import {
		Log_enum,
		LogType_enum,
		type Log_int,
		LogListType_enum,
		type MappedCheckboxItem,
		type MappedListItem,
		type MappedQuestionItem
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
	import { getContext, onMount, setContext } from 'svelte';
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
	export let checkboxItems: MappedCheckboxItem[] = [];
	export let questions: MappedQuestionItem[] = [];
	export let listItems: MappedListItem[] = [];
	export let inputAutoFocus: boolean = false;
	export let time: number = 0;
	export let listType: LogListType_enum =
		logType === LogType_enum.list ? LogListType_enum.ordered : LogListType_enum.unordered;

	let originalTitle = title;
	let originalReference = reference;
	let originalRating = rating;
	let originalCheckboxItems = checkboxItems;
	let originalQuestions = questions;
	let originalListItems = listItems;
	let originalTime = time;

	let container: HTMLButtonElement;

	const onEditLog = () => {
		$currentlyEditing = id;
	};

	const onStopEditing = () => {
		$currentlyEditing = null;
	};

	const invalidateLogs: () => void = getContext('invalidateLogs');
	const onResetNewLogType: () => void = getContext('onResetNewLogType');
	setContext('onEditLog', onEditLog);

	const isEditing = derived([currentlyEditing], ([$currentlyEditing]) => $currentlyEditing === id);

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

	const onDelete = () => {
		onStopEditing();
		$deleteLogMutation.mutate(id);
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

		const setListItems = () => {
			const filteredListItems = listItems.filter(({ item }) => item);
			values[Log_enum.listItems] = getListItemsFromMappedListItems(filteredListItems);
			originalListItems = [...filteredListItems];
		};
		const setCheckboxItems = () => {
			const filteredCheckboxItems = checkboxItems.filter(({ text }) => text);
			values[Log_enum.checkboxItems] =
				getCheckboxItemsFromMappedCheckboxItems(filteredCheckboxItems);
			originalCheckboxItems = [...filteredCheckboxItems];
		};
		const setQuestionItems = () => {
			const filteredQuestions = questions.filter(
				({ question, answer }) => question || (answer && question)
			);
			values[Log_enum.questions] = getQuestionsFromMappedQuestions(filteredQuestions);
			originalQuestions = [...filteredQuestions];
		};
		const setValuesTypeMethods: Record<LogType_enum, () => void> = {
			[LogType_enum.todo]: () => {
				setCheckboxItems();
			},
			[LogType_enum.question]: () => {
				setQuestionItems();
			},
			[LogType_enum.important]: setListItems,
			[LogType_enum.time]: () => {
				setListItems();
				values[Log_enum.time] = time;
				originalTime = time;
			},
			[LogType_enum.list]: () => {
				values[Log_enum.listType] = listType;
				if (listType === LogListType_enum.checkbox) {
					setCheckboxItems();
				} else {
					setListItems();
				}
			}
		};
		setValuesTypeMethods[logType]();

		const haveValuesChanged = getHaveValuesChanged({
			values,
			originalValues
		});

		if (!haveValuesChanged) return onStopEditing();

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
		onStopEditing();

		const setOriginalListItems = () => (originalListItems = [...listItems]);
		const setOriginalCheckboxItems = () => (originalCheckboxItems = [...checkboxItems]);
		const setOriginalQuestions = () => (originalQuestions = [...questions]);
		const setOriginalTypeItems: Record<LogType_enum, () => void> = {
			[LogType_enum.todo]: () => {
				setOriginalCheckboxItems();
			},
			[LogType_enum.question]: () => {
				setOriginalQuestions();
			},
			[LogType_enum.important]: setOriginalListItems,
			[LogType_enum.time]: () => {
				setOriginalListItems();
				originalTime = time;
			},
			[LogType_enum.list]: () => {
				if (listType === LogListType_enum.checkbox) {
					setOriginalCheckboxItems();
				} else {
					setOriginalListItems();
				}
			}
		};
		setOriginalTypeItems[logType]();
	};

	const onAddItem = () => {
		onEditLog();

		const addListItem = () => (listItems = [...listItems, { id: listItems.length, item: '' }]);
		const addCheckboxItem = () =>
			(checkboxItems = [
				...checkboxItems,
				{ id: checkboxItems.length, isChecked: false, text: '' }
			]);
		const addQuestionItem = () =>
			(questions = [...questions, { id: questions.length, question: '', answer: '' }]);
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
				if (listType === LogListType_enum.checkbox) addCheckboxItem();
				else addListItem();
			}
		};
		addItemTypeMethods[logType]();
	};

	const onDeleteItem = (index: number) => {
		const removeListItem = () => (listItems = listItems.filter((_, i) => i !== index));
		const removeCheckboxItem = () => (checkboxItems = checkboxItems.filter((_, i) => i !== index));
		const removeQuestionItem = () => (questions = questions.filter((_, i) => i !== index));
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
				if (listType === LogListType_enum.checkbox) removeCheckboxItem();
				else removeListItem();
			}
		};
		removeItemTypeMethods[logType]();
	};

	const onResetChange = () => {
		onResetNewLogType && onResetNewLogType();
		title = originalTitle;
		reference = originalReference;

		const resetListItems = () => (listItems = [...originalListItems]);
		const resetCheckboxItems = () => (checkboxItems = [...originalCheckboxItems]);
		const resetQuestions = () => (questions = [...originalQuestions]);
		const resetTypeItems: Record<LogType_enum, () => void> = {
			[LogType_enum.todo]: () => {
				resetCheckboxItems();
			},
			[LogType_enum.question]: () => {
				resetQuestions();
			},
			[LogType_enum.important]: () => {
				resetListItems();
			},
			[LogType_enum.time]: () => {
				resetListItems();
				time = originalTime;
			},
			[LogType_enum.list]: () => {
				if (listType === LogListType_enum.checkbox) resetCheckboxItems();
				else resetListItems();
			}
		};
		resetTypeItems[logType]();

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
		[LogType_enum.todo]: ['', 'border-dashed border-neutral-200 border p-2 gap-1'],
		[LogType_enum.question]: ['bg-neutral-100 p-1 rounded-sm', 'bg-white p-2 rounded-sm'],
		[LogType_enum.time]: ['p-1', 'shadow-md bg-white rounded-sm p-2 text-sm gap-1'],
		[LogType_enum.important]: ['', 'bg-neutral-50 p-2 gap-1 text-sm'],
		[LogType_enum.list]: ['', 'p-2 gap-1 text-sm border border-neutral-200 rounded-lg']
	};

	const onClickLog = () => {
		onEditLog();
	};
</script>

<button
	bind:this={container}
	use:clickOutside
	on:click_outside={onClickOutside}
	class=""
	on:click={onClickLog}
>
	<div class={containerClasses[logType][0]}>
		<div class="stack {containerClasses[logType][1]}">
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
				{#if logType === LogType_enum.todo || (logType === LogType_enum.list && listType === LogListType_enum.checkbox)}
					<div class="flex-1">
						<CheckboxItems
							bind:checkboxes={checkboxItems}
							{isEditing}
							onEnterKeydown={onTextareaEnterKeydown}
							onDeleteBullet={onDeleteItem}
							{onEdit}
						/>
					</div>
				{:else if logType === LogType_enum.question}
					<LogQuestionItems
						bind:questions
						onFocusAnswerInput={_onFocusAnswerInput}
						isDisabled={!$isEditing}
						{isEditing}
						onDeleteQuestion={onDeleteItem}
						{id}
					/>
				{:else if logType === LogType_enum.important || logType === LogType_enum.time || (logType === LogType_enum.list && listType !== LogListType_enum.checkbox)}
					<ListItems
						bind:items={listItems}
						bind:listType
						{isEditing}
						onEnterKeydown={onTextareaEnterKeydown}
						{onDeleteItem}
						{logType}
					/>
				{/if}
			</div>
			<BottomOptions
				bind:listType
				bind:listItems
				bind:checkboxItems
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
</button>

<ConfirmationDialog onConfirm={onResetChange} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
