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
		addToEndOfRaceCondition,
		checkAndCapitalizeFirstLetterOfMappedCheckboxes,
		checkAndCapitalizeFirstLetterOfMappedListItems,
		checkAndCapitalizeFirstLetterOfMappedQuestions
	} from '$lib/utils';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
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

	const onClickTextArea = (e: MouseEvent) => onClickInput(e);

	let isAnswering: undefined | number = $state();
	const onCheckboxesChange = () => onEdit();

	const onClickTextarea = (e: MouseEvent) => onClickInput(e);

	const onTextareaChange = (e: Event, index: number) =>
		onAnswerChange(index, (e.target as HTMLTextAreaElement).value);

	const _onFocusAnswerInput = (index: number) => {
		$currentlyEditing = log.id;
		isAnswering = index;
		//this is a hack to make sure the answer input is focused
		addToEndOfRaceCondition(onFocusAnswerInput);
	};

	const onAnswerChange = (index: number, value: string) => (log.questions[index].answer = value);

	const hasListItems = $derived(
		log.type === LogType_enum.important ||
			log.type === LogType_enum.time ||
			(log.type === LogType_enum.list && log.listType !== LogListType_enum.checkbox)
	);

	const hasCheckboxes = $derived(
		log.type === LogType_enum.todo ||
			(log.type === LogType_enum.list && log.listType === LogListType_enum.checkbox)
	);

	const hasQuestions = $derived(log.type === LogType_enum.question);

	const doesQuestionHaveAnswer = (index: number) => log.questions[index].answer;

	const isQuestionBeingAnswered = (index: number) => isAnswering === index;

	const items: (MappedListItem | MappedCheckboxItem | MappedQuestionItem)[] = $derived(
		hasListItems ? log.listItems : hasCheckboxes ? log.checkboxItems : log.questions
	);

	$effect(() => {
		if (hasListItems) log.listItems = checkAndCapitalizeFirstLetterOfMappedListItems(log.listItems);
		if (hasQuestions) log.questions = checkAndCapitalizeFirstLetterOfMappedQuestions(log.questions);
		if (hasCheckboxes)
			log.checkboxItems = checkAndCapitalizeFirstLetterOfMappedCheckboxes(log.checkboxItems);
	});

	const onChangeOrder = ({
		detail: { items }
	}: CustomEvent<DndEvent<MappedQuestionItem | MappedListItem | MappedCheckboxItem>>) => {
		if (hasListItems) log.listItems = items as MappedListItem[];
		if (hasQuestions) log.questions = items as MappedQuestionItem[];
		if (hasCheckboxes) log.checkboxItems = items as MappedCheckboxItem[];
	};
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
	onconsider={onChangeOrder}
	onfinalize={onChangeOrder}
>
	{#each items as item, index (item.id)}
		<li class="{index % 2 === 0 ? 'bg-transparent' : checkeredColor[log.type]} relative">
			{#if isEditing && items.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-9 top-1" />
			{/if}
			<div class="flex {hasQuestions ? 'flex-col gap-1 w-full' : 'flex-row'}">
				{#if hasListItems}
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
				{:else if hasCheckboxes}
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
				{:else if hasQuestions}
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
					{#if doesQuestionHaveAnswer(index) || isQuestionBeingAnswered(index)}
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
					{#if !doesQuestionHaveAnswer(index)}
						<Button
							_class="self-start text-xs bg-white {doesQuestionHaveAnswer(index) ||
							isQuestionBeingAnswered(index)
								? 'hidden'
								: 'block'}"
							onclick={() => _onFocusAnswerInput(index)}>Answer</Button
						>
					{/if}
				{/if}
				<div class="mt-1 flex">
					{#if isEditing}
						<button class="flex" onclick={() => onDeleteItem(index)}>
							<Icon icon={icons.delete} class="text-gray-300" height="16px" />
						</button>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ul>
