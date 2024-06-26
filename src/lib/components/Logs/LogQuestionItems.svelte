<script lang="ts">
	import { currentlyEditing } from '$lib/stores';
	import type { MappedQuestionItem } from '$lib/types';
	import Button from '../Button.svelte';
	import Textarea from '../Textarea.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import type { Readable } from 'svelte/motion';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import {
		areAnyQuestionsNotCapitalised,
		capitalizeFirstLetterOfMappedQuestions
	} from '$lib/utils';
	import type { Writable } from 'svelte/store';

	export let questions: MappedQuestionItem[];
	export let onFocusAnswerInput: () => void;
	export let id: string;
	export const onReset: () => void = () => {
		isAnswering = undefined;
	};
	export let isEditing: Readable<boolean>;
	export let onDeleteQuestion: (index: number) => void;
	export let focusElements: Writable<HTMLElement[]>;

	let isAnswering: undefined | number = undefined;

	const _onFocusAnswerInput = (index: number) => {
		$currentlyEditing = id;
		isAnswering = index;
		//this is a hack to make sure the answer input is focused
		setTimeout(() => {
			onFocusAnswerInput();
		}, 0);
	};

	const onAnswerChange = (index: number, value: string) => {
		questions[index].answer = value;
	};

	$: {
		if (areAnyQuestionsNotCapitalised(questions)) {
			questions = capitalizeFirstLetterOfMappedQuestions(questions);
		}
	}
</script>

<ul
	class="ml-2 stack flex-1 gap-3"
	use:dndzone={{
		items: questions,
		flipDurationMs: 300,
		dropTargetStyle: {},
		dragDisabled: !$isEditing
	}}
	on:consider={(e) => (questions = e.detail.items)}
	on:finalize={(e) => (questions = e.detail.items)}
>
	{#each questions as item, index (item.id)}
		<li
			class="hstack {index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50'} px-2 py-1 rounded relative"
		>
			{#if $isEditing && questions.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-4 top-6" />
			{/if}
			<div class="stack gap-1 w-full">
				<div class="hstack text-sm gap-1">
					<p class="text-neutral-400">Question:</p>
					<Textarea
						bind:textarea={$focusElements[index + 2]}
						bind:value={questions[index].question}
						className=""
						_class="flex-1"
						autofocus
					/>
				</div>
				{#if questions[index].answer || isAnswering === index}
					<div class="text-sm gap-1 flex-1 flex">
						<p class="text-neutral-400">Answer:</p>
						<Textarea
							bind:value={questions[index].answer}
							_class="flex-1"
							onChange={(e) => onAnswerChange(index, e.target?.value)}
							bind:onFocus={onFocusAnswerInput}
						/>
					</div>
				{/if}
				{#if !questions[index].answer}
					<Button
						_class="self-start text-xs bg-white {questions[index].answer || isAnswering === index
							? 'hidden'
							: 'block'}"
						onClick={() => _onFocusAnswerInput(index)}>Answer</Button
					>
				{/if}
			</div>
			<div class="center">
				{#if $isEditing}
					<button class="flex" on:click={() => onDeleteQuestion(index)}>
						<Icon icon={icons.delete} class="text-gray-300" height="18px" />
					</button>
				{/if}
			</div>
		</li>
	{/each}
</ul>
