<!-- todo: Refactor LogCheckboxItems && LogQuestionItems into this file-->
<script lang="ts">
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import {
		LogType_enum,
		LogListType_enum,
		type MappedListItem,
		type MappedCheckboxItem,
		type MappedQuestionItem,
		type MappedLog_int
	} from '$lib/types';
	import {
		checkAndCapitalizeFirstLetterOfMappedCheckboxes,
		checkAndCapitalizeFirstLetterOfMappedListItems,
		checkAndCapitalizeFirstLetterOfMappedQuestions
	} from '$lib/utils';
	import { dndzone } from 'svelte-dnd-action';
	import Button from '../Button.svelte';
	import { currentlyEditing } from '$lib/stores';

	interface Props {
		isEditing: boolean;
		onEnterKeydown: () => void;
		onDeleteItem: (index: number) => void;
		focusElements: HTMLElement[];
		onClickInput: (e: MouseEvent) => void;
		onEdit: () => void;
		onFocusAnswerInput: () => void;
		log: MappedLog_int;
	}

	let {
		isEditing,
		onEnterKeydown,
		onDeleteItem,
		focusElements = $bindable([]),
		onClickInput,
		onEdit,
		onFocusAnswerInput,
		log = $bindable()
	}: Props = $props();

	const bulletType: Record<
		LogListType_enum,
		'disc' | 'circle' | 'square' | 'checkbox' | 'decimal'
	> = {
		[LogListType_enum.ordered]: 'decimal',
		[LogListType_enum.unordered]: 'disc',
		[LogListType_enum.checkbox]: 'checkbox'
	};

	const checkeredColor: Record<LogType_enum, string> = {
		[LogType_enum.important]: 'bg-gray-50',
		[LogType_enum.question]: 'bg-gray-50',
		[LogType_enum.todo]: 'bg-gray-50',
		[LogType_enum.time]: 'bg-gray-50',
		[LogType_enum.list]: 'bg-gray-100'
	};

	$effect(() => {
		if (log.listItems)
			log.listItems = checkAndCapitalizeFirstLetterOfMappedListItems(log.listItems);
		if (log.questions)
			log.questions = checkAndCapitalizeFirstLetterOfMappedQuestions(log.questions);
		if (log.checkboxItems)
			log.checkboxItems = checkAndCapitalizeFirstLetterOfMappedCheckboxes(log.checkboxItems);
	});

	const onClickTextArea = (e: MouseEvent) => {
		onClickInput(e);
	};

	const onChangeOrder = (items: (MappedListItem | MappedCheckboxItem | MappedQuestionItem)[]) => {
		if (log.listItems) log.listItems = items as MappedListItem[];
		if (log.questions) log.questions = items as MappedQuestionItem[];
		if (log.checkboxItems) log.checkboxItems = items as MappedCheckboxItem[];
	};

	let isAnswering: undefined | number = $state();
	const onCheckboxesChange = () => onEdit();

	const onClickTextarea = (e: MouseEvent) => {
		onClickInput(e);
	};

	const onTextareaChange = (e: Event, index: number) =>
		onAnswerChange(index, (e.target as HTMLTextAreaElement).value);

	const _onFocusAnswerInput = (index: number) => {
		$currentlyEditing = log.id;
		isAnswering = index;
		//this is a hack to make sure the answer input is focused
		setTimeout(() => {
			onFocusAnswerInput();
		}, 0);
	};

	const onAnswerChange = (index: number, value: string) => (log.questions[index].answer = value);

	const showListItems = $derived(
		log.type === LogType_enum.important ||
			log.type === LogType_enum.time ||
			(log.type === LogType_enum.list && log.listType !== LogListType_enum.checkbox)
	);

	const showCheckboxes = $derived(
		log.type === LogType_enum.todo ||
			(log.type === LogType_enum.list && log.listType === LogListType_enum.checkbox)
	);

	const showQuestions = $derived(log.type === LogType_enum.question);

	const items: (MappedListItem | MappedCheckboxItem | MappedQuestionItem)[] = $derived(
		showListItems ? log.listItems : showCheckboxes ? log.checkboxItems : log.questions
	);
</script>

<ul
	class="ml-8 stack w-full"
	style={`list-style-type:${bulletType[log.listType]}`}
	use:dndzone={{
		items,
		flipDurationMs: 300,
		dropTargetStyle: {},
		dragDisabled: !isEditing
	}}
	onconsider={(e) => onChangeOrder(e.detail.items)}
	onfinalize={(e) => onChangeOrder(e.detail.items)}
>
	{#each items as item, index (item.id)}
		<li class="{index % 2 === 0 ? 'bg-transparent' : checkeredColor[log.type]} relative">
			{#if isEditing && items.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-9 top-1" />
			{/if}
			<div class="flex {log.questions ? 'flex-col gap-1 w-full' : 'flex-row'}">
				{#if showListItems}
					<div class="flex gap-2 min-h-[20px] flex-1">
						<div class="flex-1">
							<Textarea
								_class="w-full"
								bind:value={log.listItems[index].item}
								bind:textarea={focusElements[focusElements.length]}
								{onEnterKeydown}
								autofocus={index > 0}
								onclick={onClickTextArea}
								isDisabled={!isEditing}
							/>
						</div>
					</div>
				{:else if showCheckboxes}
					<input
						bind:checked={log.checkboxItems[index].isChecked}
						type="checkbox"
						class="mr-[7px]"
						onchange={onCheckboxesChange}
						onclick={onClickInput}
					/>
					<div class="flex gap-2 min-h-[20px] flex-1">
						<div class="flex-1">
							<Textarea
								bind:textarea={focusElements[focusElements.length]}
								bind:value={log.checkboxItems[index].text}
								_class="flex-1 w-full"
								{onEnterKeydown}
								autofocus={index > 0}
								onclick={onClickInput}
								isDisabled={!isEditing}
							/>
						</div>
					</div>
				{:else if showQuestions}
					<div class="hstack text-sm gap-1">
						<p class="text-neutral-400">Question:</p>
						<Textarea
							bind:textarea={focusElements[focusElements.length]}
							bind:value={log.questions[index].question}
							className=""
							_class="flex-1"
							autofocus
							isDisabled={!isEditing}
							onclick={onClickTextarea}
						/>
					</div>
					{#if log.questions[index].answer || isAnswering === index}
						<div class="text-sm gap-1 flex-1 flex">
							<p class="text-neutral-400">Answer:</p>
							<Textarea
								bind:value={log.questions[index].answer}
								bind:onFocus={onFocusAnswerInput}
								_class="flex-1"
								onchange={(e:Event) => onTextareaChange(e, index)}
								onclick={onClickTextarea}
							/>
						</div>
					{/if}
					{#if !log.questions[index].answer}
						<Button
							_class="self-start text-xs bg-white {log.questions[index].answer ||
							isAnswering === index
								? 'hidden'
								: 'block'}"
							onclick={() => _onFocusAnswerInput(index)}>Answer</Button
						>
					{/if}
				{/if}
				<div class="mt-1 flex sm:hidden">
					{#if isEditing}
						<button class="flex sm:hidden" onclick={() => onDeleteItem(index)}>
							<Icon icon={icons.delete} class="text-gray-300" height="18px" />
						</button>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ul>
