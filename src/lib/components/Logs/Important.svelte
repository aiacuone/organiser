<script lang="ts">
	import { icons } from '$lib/general/icons';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	import Textarea from '../Textarea.svelte';
	import { getContext } from 'svelte';
	import { LogType_enum, type Log_int } from '$lib/types';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import { page } from '$app/stores';
	import { getHaveValuesChanged } from '$lib/utils/logs';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';

	export let date: Date = new Date();
	export let content: string;
	export let id: string;
	export let importance: number;
	export let isEditing: boolean = false;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;

	let originalContent = content;
	let originalImportance = importance;
	let originalDate = date;
	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;

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
		date.setHours(currentDate.getHours());
		date.setMinutes(currentDate.getMinutes());

		const haveValuesChanged = getHaveValuesChanged({
			values: {
				content,
				importance
			},
			originalValues: {
				content: originalContent,
				importance: originalImportance
			}
		});

		isEditing = false;

		if (!haveValuesChanged) return;

		$updateMutation.mutate({
			id,
			content,
			importance,
			date,
			type: LogType_enum.important,
			space: $page.params.space,
			lastUpdated: date
		});
		originalContent = content;
		originalImportance = importance;
		originalDate = date;

		onResetNewLogType();
	};

	const onResetChange = () => {
		isEditing = false;
		onResetNewLogType();
		content = originalContent;
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (importance = importance + 1),
		onDecrement: () => (importance = importance - 1)
	};
</script>

<LogContainer
	{isEditing}
	onConfirmReset={onResetChange}
	bind:updateLogMutation={updateMutation}
	bind:deleteLogMutation={deleteMutation}
>
	<div class="bg-neutral-50 p-2 sm:p-3 stack gap-3">
		<div class="hstack center gap-2">
			<IconWithRating rating={importance} icon={icons.important} />
			<div class="flex-1">
				{#if isEditing}
					<Textarea bind:value={content} autofocus={inputAutoFocus} />
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
			{isEditing}
			{onAccept}
			{incrementDecrementProps}
			incrementDecrementValue={importance}
			showIncrementDecrement={isEditing}
			{lastUpdated}
		/>
	</div>
</LogContainer>
