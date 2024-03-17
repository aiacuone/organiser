import { icons } from '$lib/general/icons';
import {
	LogType_enum,
	type BaseMappedListItem_int,
	type CheckboxItem_int,
	type Log_enum,
	type Log_int,
	type QuestionItem_int,
	type MappedCheckboxItem,
	type MappedListItem
} from '$lib/types';

export const getHaveValuesChanged = ({
	values,
	originalValues
}: {
	values: Partial<Log_int>;
	originalValues: Partial<Log_int>;
}) => {
	return Object.keys(values).some(
		(key) => values[key as Log_enum] !== originalValues[key as Log_enum]
	);
};

export const arraysHaveSameValues = (arr1: string[], arr2: string[]): boolean => {
	if (arr1.length !== arr2.length) {
		return false;
	}

	const sortedArr1 = arr1.slice().sort();
	const sortedArr2 = arr2.slice().sort();

	for (let i = 0; i < sortedArr1.length; i++) {
		if (sortedArr1[i] !== sortedArr2[i]) {
			return false;
		}
	}

	return true;
};

export const getMappedListItems = (items: string[]): MappedListItem[] =>
	items.map((item, index) => ({ id: index, item }));

export const getListItemsFromMappedListItems = (mappedListItems: MappedListItem[]): string[] =>
	mappedListItems.map(({ item }) => item);

export const getMappedCheckboxItems = (items: CheckboxItem_int[]): MappedCheckboxItem[] =>
	items.map((item, index) => ({ id: index, ...item }));

export const getCheckboxItemsFromMappedCheckboxItems = (
	mappedCheckboxItems: MappedCheckboxItem[]
): CheckboxItem_int[] => mappedCheckboxItems.map(({ text, isChecked }) => ({ text, isChecked }));

export const getMappedQuestions = (
	items: QuestionItem_int[]
): (BaseMappedListItem_int & QuestionItem_int)[] =>
	items.map((question, index) => ({ id: index, ...question }));

export const getQuestionsFromMappedQuestions = (
	mappedQuestions: (BaseMappedListItem_int & QuestionItem_int)[]
): QuestionItem_int[] => mappedQuestions.map(({ question, answer }) => ({ question, answer }));

export const logIcons: Record<LogType_enum, string> = {
	[LogType_enum.time]: icons.clock,
	[LogType_enum.important]: icons.important,
	[LogType_enum.todo]: icons.todo,
	[LogType_enum.question]: icons.question,
	[LogType_enum.list]: icons.list
};

export const getCheckboxItemsFromMappedListItems = (
	listItems: MappedListItem[]
): MappedCheckboxItem[] => {
	return listItems.map(({ item, id }) => ({ id, text: item, isChecked: false }));
};

export const getListItemsFromMappedCheckboxItems = (
	checkboxItems: MappedCheckboxItem[]
): MappedListItem[] => {
	return checkboxItems.map(({ text, id }) => ({ id, item: text }));
};
