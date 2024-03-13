<script lang="ts">
	import { currentlyEditing } from '$lib/stores';
	import type { BaseMappedListItem_int, QuestionItem_int } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import Button from '../Button.svelte';
	import Textarea from '../Textarea.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import type { Readable } from 'svelte/motion';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';

	export let questions: Writable<(BaseMappedListItem_int & QuestionItem_int)[]>;
	export let isDisabled: boolean;
	export let onFocusAnswerInput: () => void;
	export let id: string;
	export const onReset: () => void = () => {
		isAnswering = undefined;
	};
	export let isEditing: Readable<boolean>;
	export let onDeleteQuestion: (index: number) => void;

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
		$questions[index].answer = value;
	};
</script>

<ul
	class="ml-5 stack flex-1"
	use:dndzone={{
		items: $questions,
		flipDurationMs: 300,
		dropTargetStyle: {},
		dragDisabled: !$isEditing
	}}
	on:consider={(e) => ($questions = e.detail.items)}
	on:finalize={(e) => ($questions = e.detail.items)}
>
	{#each $questions as item, index (item.id)}
		<li
			class="hstack {index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50'} px-2 py-1 rounded relative"
		>
			{#if $isEditing && $questions.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-4 top-6" />
			{/if}
			<div class="stack gap-1 w-full min-h-[60px]">
				<div class="hstack text-sm gap-1">
					<p class="text-neutral-400">Question:</p>
					<Textarea
						bind:value={$questions[index].question}
						className=""
						{isDisabled}
						_class="flex-1"
						autofocus
					/>
				</div>
				{#if $questions[index].answer || isAnswering === index}
					<div class="text-sm gap-1 flex-1 flex">
						<p class="text-neutral-400">Answer:</p>
						<Textarea
							value={$questions[index].answer ?? ''}
							_class="flex-1"
							onChange={(e) => onAnswerChange(index, e.target?.value)}
							{isDisabled}
							bind:onFocus={onFocusAnswerInput}
						/>
					</div>
				{/if}
				{#if !$questions[index].answer}
					<Button
						_class="self-start text-xs {$questions[index].answer || isAnswering === index
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
