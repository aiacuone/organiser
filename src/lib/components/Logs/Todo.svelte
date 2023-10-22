<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import BottomOptions from './BottomOptions.svelte';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	import Textarea from '../Textarea.svelte';
	import { getContext } from 'svelte';
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import { LogType_enum } from '$lib/types';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import { page } from '$app/stores';

	export let date: Date;
	export let content: string | string[];
	export let id: string;
	export let priority: number;
	export let isChecked: boolean = false;
	export let isEditing: boolean = false;
	export let inputAutoFocus: boolean = false;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onCheckboxClick = () => {
		isChecked = !isChecked;
	};

	const onEdit = () => {
		isEditing = true;
	};

	const onDelete = () => {
		deleteLog(id);
	};

	let onOpen: () => void;

	const onAccept = () => {
		isEditing = false;
		updateLog({
			id,
			content,
			priority,
			date: getDateFromHyphenatedString($page.params.date),
			type: LogType_enum.todo,
			space: $page.params.space
		});
	};

	const onResetChange = () => {
		isEditing = false;
		onResetNewLogType();
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (priority = priority + 1),
		onDecrement: () => (priority = priority - 1)
	};
</script>

<LogContainer {isEditing} onConfirmReset={onResetChange}>
	<div class="border-dashed border-neutral-200 border px-3 py-4 stack gap-4">
		<div class="hstack gap-4 items-center">
			<IconWithRating icon={icons.todo} rating={priority} />
			<button
				on:click={onOpen}
				class="center border-2 border-gray-400 w-[35px] h-[35px] rounded-md"
			>
				{#if isChecked}
					<Icon icon={icons.tickBold} height="20px" color="#32ed65" class="text-green" />
				{/if}
			</button>
			<div class="flex-1">
				{#if isEditing}
					<Textarea bind:value={content} autofocus={inputAutoFocus} />
				{:else}
					<p class="text-sm">{content}</p>
				{/if}
			</div>
		</div>
		<BottomOptions
			{onEdit}
			{onDelete}
			{date}
			{isEditing}
			{onAccept}
			{incrementDecrementProps}
			incrementDecrementValue={priority}
			showIncrementDecrement={isEditing}
		/>
	</div>
</LogContainer>

<ConfirmationDialog bind:onOpen onConfirm={onCheckboxClick}>Are you sure?</ConfirmationDialog>
