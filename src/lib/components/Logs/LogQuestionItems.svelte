<!-- todo: Refactor this into LogListItems along with LogCheckboxItems -->
<script lang="ts">
	import { currentlyEditing } from '$lib/stores';
	import type { MappedQuestionItem } from '$lib/types';
	import Button from '../Button.svelte';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import {
		areAnyQuestionsNotCapitalised,
		capitalizeFirstLetterOfMappedQuestions
	} from '$lib/utils';
	import { dndzone } from 'svelte-dnd-action';

	interface Props {
		questions: MappedQuestionItem[];
		onFocusAnswerInput: () => void;
		id: string;
		isEditing: boolean;
		onDeleteQuestion: (index: number) => void;
		focusElements: HTMLElement[];
		onClickInput: (e: MouseEvent) => void;
	}

	let {
		questions = $bindable([{ question: '', answer: '', id: 0 }]),
		onFocusAnswerInput,
		id,
		isEditing,
		onDeleteQuestion,
		focusElements = $bindable([]),
		onClickInput
	}: Props = $props();

	let isAnswering: undefined | number = $state();

	const _onFocusAnswerInput = (index: number) => {
		$currentlyEditing = id;
		isAnswering = index;
		//this is a hack to make sure the answer input is focused
		setTimeout(() => {
			onFocusAnswerInput();
		}, 0);
	};

	const onAnswerChange = (index: number, value: string) => (questions[index].answer = value);

	$effect(() => {
		if (areAnyQuestionsNotCapitalised(questions)) {
			questions = capitalizeFirstLetterOfMappedQuestions(questions);
		}
	});

	const onTextareaChange = (e: Event, index: number) =>
		onAnswerChange(index, (e.target as HTMLTextAreaElement).value);

	const onClickTextarea = (e: MouseEvent) => {
		onClickInput(e);
	};
</script>

<ul
	class="ml-2 stack flex-1 gap-3"
	use:dndzone={{
		items: questions,
		flipDurationMs: 300,
		dropTargetStyle: {},
		dragDisabled: !isEditing
	}}
	onconsider={(e) => (questions = e.detail.items)}
	onfinalize={(e) => (questions = e.detail.items)}
>
	{#each questions as item, index (item.id)}
		<li
			class="hstack {index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50'} px-2 py-1 rounded relative"
		>
			{#if isEditing && questions.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-4 top-6" />
			{/if}
			<div class="stack gap-1 w-full">
				<div class="hstack text-sm gap-1">
					<p class="text-neutral-400">Question:</p>
					<Textarea
						bind:textarea={focusElements[focusElements.length]}
						bind:value={questions[index].question}
						onchange={(e:Event) => (questions[index].question = (e.target as HTMLInputElement).value)}
						className=""
						_class="flex-1"
						autofocus
						isDisabled={!isEditing}
						onclick={onClickTextarea}
					/>
				</div>
				{#if questions[index].answer || isAnswering === index}
					<div class="text-sm gap-1 flex-1 flex">
						<p class="text-neutral-400">Answer:</p>
						<Textarea
							bind:value={questions[index].answer}
							bind:onFocus={onFocusAnswerInput}
							_class="flex-1"
							onchange={(e:Event) => onTextareaChange(e, index)}
							onclick={onClickTextarea}
						/>
					</div>
				{/if}
				{#if !questions[index].answer}
					<Button
						_class="self-start text-xs bg-white {questions[index].answer || isAnswering === index
							? 'hidden'
							: 'block'}"
						onclick={() => _onFocusAnswerInput(index)}>Answer</Button
					>
				{/if}
			</div>
			<div class="center">
				{#if isEditing}
					<button class="flex" onclick={() => onDeleteQuestion(index)}>
						<Icon icon={icons.delete} class="text-gray-300" height="18px" />
					</button>
				{/if}
			</div>
		</li>
	{/each}
</ul>
