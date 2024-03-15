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
		getCheckboxItemsFromMappedCheckboxItems,
		getDateFromHyphenatedString,
		getHaveValuesChanged,
		getHyphenatedStringFromDate,
		getListItemsFromMappedListItems,
		getQuestionsFromMappedQuestions
	} from '$lib/utils';
	import { page } from '$app/stores';
	import { useMutation } from '@sveltestack/svelte-query/dist/mutation/useMutation';
	import { getContext, onMount } from 'svelte';
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import toast from 'svelte-french-toast';
	import { derived } from 'svelte/store';
	import Dialog from '../Dialog/Dialog.svelte';
	import Button from '../Button.svelte';
	import { isDropdownOpen } from '$lib/stores';
	import { currentlyEditing, titlesAndReferences } from '$lib/stores';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';

	export let logType: LogType_enum;
	export let title: string = '';
	export let reference: string = '';
	export let date: Date;
	export let id: string;
	export let rating: 1 | 2 | 3;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;

	let originalTitle = title;
	let originalReference = reference;
	let originalRating = rating;

	export let checkboxItems: (BaseMappedListItem_int & CheckboxItem_int)[] = [];
	export let questions: (BaseMappedListItem_int & QuestionItem_int)[] = [];
	export let listItems: (BaseMappedListItem_int & ListItem_int)[] = [];

	let originalCheckboxItems = [...checkboxItems];
	let originalQuestions = questions;
	let originalListItems = listItems;

	const invalidateLogs: () => void = getContext('invalidateLogs');
	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	let container: HTMLDivElement;

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

	let changeReferenceInputValue: ((value: string | undefined) => void) | undefined = undefined;

	const onTitleAutoFill = (_title: string) => {
		const correspondingReference = $titlesAndReferences.find((t) => t.title === _title)?.reference;

		changeReferenceInputValue && changeReferenceInputValue(correspondingReference ?? undefined);
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

	const onDeleteItem = (id: number) => {
		if (logType === LogType_enum.todo) {
			checkboxItems = checkboxItems.filter((_, i) => i !== id);
		} else if (logType === LogType_enum.question) {
			questions = questions.filter((_, i) => i !== id);
		} else if (logType === LogType_enum.important || logType === LogType_enum.time) {
			listItems = listItems.filter((_, i) => i !== id);
		}
	};

	const onControlShitAndDotKeydown = () => {
		onAddItem();
	};
	const onControlShitAndEnterKeydown = () => {
		onAccept();
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		listItems = originalListItems;
		title = originalTitle;
		reference = originalReference;
	};

	onMount(() => {
		const keydown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
				onControlShitAndEnterKeydown();
			}
			if (e.ctrlKey && e.shiftKey && e.key === '.') {
				onControlShitAndDotKeydown();
			}
		};

		onMount(() => {
			if (editOnMount) {
				$currentlyEditing = id;
			}
		});

		container.addEventListener('keydown', keydown);

		return () => {
			container.removeEventListener('keydown', keydown);
		};
	});

	let onOpen: () => void;
	let onClose: () => void;
	let isOpen: boolean;

	const onClickOutside = () => {
		$isEditing && !isOpen && !$isDropdownOpen && onOpen();
	};
</script>

<div bind:this={container} use:clickOutside on:click_outside={onClickOutside} class="">
	<div />
</div>

<Dialog bind:onOpen bind:isOpen bind:onClose>
	<div class="stack center gap-1">
		Please add some content to your log.
		<Button onClick={onClose}>OK</Button>
	</div>
</Dialog>

<ConfirmationDialog onConfirm={onResetChange} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
