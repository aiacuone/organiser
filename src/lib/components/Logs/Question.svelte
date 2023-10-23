<script lang="ts">
	import { icons } from '$lib/general/icons';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	import Textarea from '../Textarea.svelte';
	import { getContext } from 'svelte';
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import { page } from '$app/stores';
	import { LogType_enum } from '$lib/types';
	import { getDateFromHyphenatedString, getDayMonthYearFromDate } from '$lib/utils';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	export let date: Date;
	export let content: string;
	export let id: string;
	export let importance: number;
	export let isEditing: boolean = false;
	export let inputAutoFocus: boolean = false;

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

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onEdit = () => {
		isEditing = true;
	};

	const onDelete = () => {
		isEditing = false;
		$deleteMutation.mutate(id);
	};

	const onAccept = () => {
		const currentDate = new Date();
		const date = new Date(getDateFromHyphenatedString($page.params.date));
		date.setTime(currentDate.getTime());

		isEditing = false;
		$updateMutation.mutate({
			id,
			content,
			importance,
			date,
			type: LogType_enum.question,
			space: $page.params.space
		});
		onResetNewLogType();
	};

	const onResetChange = () => {
		isEditing = false;
		onResetNewLogType();
	};

	const incrementDecrementProps = {
		min: 1,
		max: 3,
		onIncrement: () => (importance = importance + 1),
		onDecrement: () => (importance = importance - 1)
	};
</script>

<LogContainer {isEditing} onConfirmReset={onResetChange}>
	<div class="bg-neutral-100 p-1 rounded-sm">
		<div class="bg-white px-3 py-3 stack gap-3 rounded-sm">
			<div class="hstack center gap-2">
				<IconWithRating icon={icons.question} rating={importance} />
				<div class="flex flex-1 items-center min-h-[30px]">
					{#if isEditing}
						<Textarea bind:value={content} className="" autofocus={inputAutoFocus} />
					{:else}
						<p class="text-sm">
							{content}
						</p>
					{/if}
				</div>
			</div>
			<BottomOptions
				{onEdit}
				{onDelete}
				{date}
				{onAccept}
				{isEditing}
				{incrementDecrementProps}
				incrementDecrementValue={importance}
				showIncrementDecrement={isEditing}
			/>
		</div>
	</div>
</LogContainer>
