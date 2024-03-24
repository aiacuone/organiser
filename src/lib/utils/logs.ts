import { icons } from '$lib/general/icons';
import {
	LogType_enum,
	type CheckboxItem_int,
	type QuestionItem_int,
	type MappedCheckboxItem,
	type MappedListItem,
	type MappedQuestionItem,
	Log_enum,
	type MappedLog_int,
	type Log_int,
	LogListType_enum,
	type ListItem_int
} from '$lib/types';
import { capitalizeFirstLetter } from './strings';

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

export const getMappedLog = (log: Log_int): MappedLog_int => {
	return {
		...log,
		inputAutoFocus: false,
		editOnMount: false,
		[Log_enum.title]: log[Log_enum.title] ?? '',
		[Log_enum.reference]: log[Log_enum.reference] ?? '',
		[Log_enum.time]: log[Log_enum.time] ?? 2,
		[Log_enum.listItems]: getMappedListItems(log[Log_enum.listItems]),
		[Log_enum.checkboxItems]: getMappedCheckboxItems(log[Log_enum.checkboxItems]),
		[Log_enum.questions]: getMappedQuestions(log[Log_enum.questions]),
		[Log_enum.rating]: log[Log_enum.rating] as 1 | 2 | 3,
		[Log_enum.listType]: log.listType ?? LogListType_enum.ordered,
		[Log_enum.space]: log.space.toLowerCase()
	};
};

export const getLogFromMappedLog = (mappedLog: MappedLog_int): Log_int => {
	const keysToOmit = ['inputAutoFocus', 'editOnMount'];
	const filteredMappedLog = Object.fromEntries(
		Object.entries(mappedLog).filter(([key]) => !keysToOmit.includes(key))
	);

	return {
		...filteredMappedLog,
		[Log_enum.listItems]: getListItemsFromMappedListItems(mappedLog[Log_enum.listItems]),
		[Log_enum.checkboxItems]: getCheckboxItemsFromMappedCheckboxItems(
			mappedLog[Log_enum.checkboxItems]
		),
		[Log_enum.questions]: getQuestionsFromMappedQuestions(mappedLog[Log_enum.questions])
	} as Log_int;
};

export const areAnyListItemsNotCapitalised = (items: ListItem_int[]) =>
	items.some((item) => item.item && item.item[0] !== item.item[0].toUpperCase());

export const capitalizeFirstLetterOfMappedListItems = (items: MappedListItem[]) =>
	items.map((item) => ({
		...item,
		item: capitalizeFirstLetter(item.item)
	}));

export const areAnyQuestionsNotCapitalised = (questions: QuestionItem_int[]) =>
	questions.some(
		(question) =>
			(question.question && question.question[0] !== question.question[0].toUpperCase()) ||
			(question.answer && question.answer[0] !== question.answer[0].toUpperCase())
	);

export const capitalizeFirstLetterOfMappedQuestions = (questions: MappedQuestionItem[]) =>
	questions.map((question) => ({
		...question,
		question: capitalizeFirstLetter(question.question),
		answer: capitalizeFirstLetter(question.answer)
	}));

export const areAnyCheckboxItemsNotCapitalised = (checkboxItems: MappedCheckboxItem[]) =>
	checkboxItems.some((item) => item.text && item.text[0] !== item.text[0].toUpperCase());

export const capitalizeFirstLetterOfMappedCheckboxItems = (checkboxItems: MappedCheckboxItem[]) =>
	checkboxItems.map((item) => ({
		...item,
		text: capitalizeFirstLetter(item.text)
	}));
