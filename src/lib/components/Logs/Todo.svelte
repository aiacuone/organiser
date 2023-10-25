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
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import { getHaveValuesChanged } from '$lib/utils/logs';

	export let date: Date;
	export let content: string;
	export let id: string;
	export let priority: number;
	export let isCompleted: boolean = false;
	export let isEditing: boolean = false;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;

	let originalContent = content;
	let originalPriority = priority;
	let originalDate = date;
	let originalIsCompleted = isCompleted;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const queryClient = useQueryClient();

	export const deleteMutation = useMutation(deleteLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
		}
	});

	export const updateMutation = useMutation(updateLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
		}
	});

	const onCheckboxClick = () => {
		isCompleted = !isCompleted;
		$updateMutation.mutate({
			id,
			content,
			priority,
			date,
			type: LogType_enum.todo,
			space: $page.params.space,
			isCompleted
		});
	};

	const onEdit = () => {
		isEditing = true;
	};

	const onDelete = () => {
		$deleteMutation.mutate(id);
	};

	let onOpen: () => void;

	const onAccept = async () => {
		const currentDate = new Date();
		const date = new Date(getDateFromHyphenatedString($page.params.date));
		date.setHours(currentDate.getHours());
		date.setMinutes(currentDate.getMinutes());

		const haveValuesChanged = getHaveValuesChanged({
			values: {
				content,
				priority,
				isCompleted
			},
			originalValues: {
				content: originalContent,
				priority: originalPriority,
				isCompleted: originalIsCompleted
			}
		});

		if (!haveValuesChanged) return (isEditing = false);

		try {
			await $updateMutation.mutate({
				id,
				content,
				priority,
				date,
				type: LogType_enum.todo,
				space: $page.params.space,
				isCompleted,
				lastUpdated: date
			});
			onResetNewLogType();
			originalContent = content;
			originalPriority = priority;
			originalDate = date;
			originalIsCompleted = isCompleted;

			console.log('updateMutation');
		} catch (error) {}
		isEditing = false;
	};

	const onResetChange = () => {
		isEditing = false;
		onResetNewLogType();
		content = originalContent;
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (priority = priority + 1),
		onDecrement: () => (priority = priority - 1)
	};
</script>

<LogContainer {isEditing} onConfirmReset={onResetChange}>
	<div class="border-dashed border-neutral-200 border p-2 sm:p-3 stack gap-4">
		<div class="hstack gap-4 items-center">
			<IconWithRating icon={icons.todo} rating={priority} />
			<button
				on:click={onOpen}
				class="center border-2 border-gray-400 w-[35px] h-[35px] rounded-md"
			>
				{#if isCompleted}
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
			{lastUpdated}
		/>
	</div>
</LogContainer>

<ConfirmationDialog bind:onOpen onConfirm={onCheckboxClick}>Are you sure?</ConfirmationDialog>
