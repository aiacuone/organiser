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
		getCheckboxItemsFromMappedCheckboxItems,
		getDateFromHyphenatedString,
		getHaveValuesChanged,
		getHyphenatedStringFromDate,
		getListItemsFromMappedListItems,
		getQuestionsFromMappedQuestions
	} from '$lib/utils';
	import { page } from '$app/stores';
	import { currentlyEditing } from '$lib/stores';
	import { useMutation } from '@sveltestack/svelte-query/dist/mutation/useMutation';
	import { getContext } from 'svelte';
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import toast from 'svelte-french-toast';

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
</script>
