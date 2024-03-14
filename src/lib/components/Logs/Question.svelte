<script lang="ts">
	import { icons } from '$lib/general/icons';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	import { getContext } from 'svelte';
	import { page } from '$app/stores';
	import {
		LogType_enum,
		type BaseMappedListItem_int,
		type Log_int,
		type QuestionItem_int
	} from '$lib/types';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import {
		getHaveValuesChanged,
		getMappedQuestions,
		getQuestionsFromMappedQuestions
	} from '$lib/utils/logs';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';
	import { currentlyEditing, titles } from '$lib/stores';
	import Input from '../Input.svelte';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import type { Readable } from 'svelte/motion';
	import LogQuestionItems from './LogQuestionItems.svelte';

	export let title: string = '';
	export let reference: string = '';
	export let date: Date;
	export let questions: (BaseMappedListItem_int & QuestionItem_int)[];
	export let id: string;
	export let rating: 1 | 2 | 3;
	export let editOnMount: boolean = false;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;

	let onTitleAutoFill: (title: string) => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let originalTitle = title;
	let originalReference = reference;
	let originalQuestions = questions;
	let originalRating = rating;
	let onEdit: () => void;
	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;
	let onDelete: () => void;
	let isEditing: Readable<boolean>;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onAccept = () => {
		const haveValuesChanged = getHaveValuesChanged({
			values: {
				questions: [...questions],
				rating
			},
			originalValues: {
				questions: [...originalQuestions],
				rating: originalRating
			}
		});

		const filteredQuestions = questions.filter(
			({ question, answer }) => question || (answer && question)
		);

		$currentlyEditing = null;

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
			title,
			reference,
			id,
			questions: getQuestionsFromMappedQuestions(filteredQuestions),
			rating,
			date: logDate,
			type: LogType_enum.question,
			space: $page.params.space,
			lastUpdated: new Date()
		});
		originalTitle = title;
		originalReference = reference;
		originalQuestions = [...filteredQuestions];
		originalRating = rating;

		onResetNewLogType && onResetNewLogType();
		onResetItems();
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		questions = [...originalQuestions];
		onResetItems();
	};

	const incrementDecrementProps = {
		min: 1,
		max: 3,
		onIncrement: () => (rating = rating + 1),
		onDecrement: () => (rating = rating - 1)
	};
	let onFocusAnswerInput: () => void;
	const _onFocusAnswerInput = () => {
		$currentlyEditing = id;
		//this is a hack to make sure the answer input is focused
		setTimeout(() => {
			onFocusAnswerInput();
		}, 0);
	};

	const onAddQuestion = () => {
		$currentlyEditing = id;
		questions = [...questions, { question: '', id: questions.length }];
	};

	let onResetItems: () => void;

	const onDeleteQuestion = (index: number) => {
		questions = questions.filter((_, i) => i !== index);
	};
	$: questions, console.log({ questions });
</script>

<LogContainer
	bind:isEditing
	bind:onEdit
	onConfirmReset={onResetChange}
	bind:updateLogMutation={updateMutation}
	bind:deleteLogMutation={deleteMutation}
	bind:onDelete
	{id}
	bind:onTitleAutoFill
	{changeReferenceInputValue}
	{editOnMount}
	onControlShitAndDotKeydown={onAddQuestion}
	onControlShitAndEnterKeydown={onAccept}
>
	<div class="bg-neutral-100 p-1 rounded-sm">
		<div class="bg-white p-2 stack gap-3 rounded-sm">
			{#if title || reference || $isEditing}
				<div class="stack">
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
			<div class="hstack center gap-2">
				<IconWithRating icon={icons.question} {rating} />
				<LogQuestionItems
					bind:questions
					onFocusAnswerInput={_onFocusAnswerInput}
					{id}
					isDisabled={!$isEditing}
					bind:onReset={onResetItems}
					{isEditing}
					{onDeleteQuestion}
				/>
			</div>
			<BottomOptions
				{onEdit}
				{onDelete}
				{date}
				{onAccept}
				isEditing={$isEditing}
				{incrementDecrementProps}
				incrementDecrementValue={rating}
				showIncrementDecrement={$isEditing}
				{lastUpdated}
				onAddItem={onAddQuestion}
			/>
		</div>
	</div>
</LogContainer>
