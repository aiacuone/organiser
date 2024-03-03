<script lang="ts">
	import { currentlyEditing } from '$lib/stores';
	import type { QuestionItem_int } from '$lib/types';
	import Button from '../Button.svelte';
	import Textarea from '../Textarea.svelte';

	export let questions: QuestionItem_int[];
	export let isDisabled: boolean;
	export let onFocusAnswerInput: () => void;
	export let id: string;
	export const onReset: () => void = () => {
		isAnswering = undefined;
	};

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
</script>

<ul class="ml-5 stack flex-1">
	{#each questions as _, index}
		<li>
			<div class="stack gap-1 w-full min-h-[60px]">
				<div class="hstack text-sm gap-1">
					<p class="text-gray-300">Question:</p>
					<Textarea
						bind:value={questions[index].question}
						className=""
						{isDisabled}
						_class="flex-1"
						autofocus
					/>
				</div>
				{#if questions[index].answer || isAnswering === index}
					<div class="text-sm gap-1 flex-1 flex">
						<p class="text-gray-300">Answer:</p>
						<Textarea
							value={questions[index].answer ?? ''}
							_class="flex-1"
							onChange={(e) => onAnswerChange(index, e.target?.value)}
							{isDisabled}
							bind:onFocus={onFocusAnswerInput}
						/>
					</div>
				{/if}
				{#if !questions[index].answer}
					<Button
						_class="self-start text-xs {questions[index].answer || isAnswering === index
							? 'hidden'
							: 'block'}"
						onClick={() => _onFocusAnswerInput(index)}>Answer</Button
					>
				{/if}
			</div>
		</li>
	{/each}
</ul>