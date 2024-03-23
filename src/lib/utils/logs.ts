import { icons } from '$lib/general/icons';
import {
	LogType_enum,
	type CheckboxItem_int,
	type QuestionItem_int,
	type MappedCheckboxItem,
	type MappedListItem,
	type MappedQuestionItem
} from '$lib/types';

export const getMappedListItems = (items: string[] = []): MappedListItem[] =>
	items.map((item, index) => ({ id: index, item }));

export const getListItemsFromMappedListItems = (mappedListItems: MappedListItem[] = []): string[] =>
	mappedListItems.map(({ item }) => item);

export const getMappedCheckboxItems = (items: CheckboxItem_int[] = []): MappedCheckboxItem[] =>
	items.map((item, index) => ({ id: index, ...item }));

export const getCheckboxItemsFromMappedCheckboxItems = (
	mappedCheckboxItems: MappedCheckboxItem[] = []
): CheckboxItem_int[] => mappedCheckboxItems.map(({ text, isChecked }) => ({ text, isChecked }));

export const getMappedQuestions = (items: QuestionItem_int[] = []): MappedQuestionItem[] =>
	items.map((question, index) => ({ id: index, ...question }));

export const getQuestionsFromMappedQuestions = (
	mappedQuestions: MappedQuestionItem[] = []
): QuestionItem_int[] => {
	return mappedQuestions.map(({ question, answer }) => {
		return { question, answer };
	});
};

export const getCheckboxItemsFromMappedListItems = (
	listItems: MappedListItem[] = []
): MappedCheckboxItem[] => {
	return listItems.map(({ item, id }) => ({ id, text: item, isChecked: false }));
};

export const getListItemsFromMappedCheckboxItems = (
	checkboxItems: MappedCheckboxItem[] = []
): MappedListItem[] => {
	return checkboxItems.map(({ text, id }) => ({ id, item: text }));
};

export const logIcons: Record<LogType_enum, string> = {
	[LogType_enum.time]: icons.clock,
	[LogType_enum.important]: icons.important,
	[LogType_enum.todo]: icons.todo,
	[LogType_enum.question]: icons.question,
	[LogType_enum.list]: icons.list
};
