<script lang="ts">
	import Accept from './Buttons/Accept.svelte';
	import AddBullet from './Buttons/AddBullet.svelte';
	import Delete from './Buttons/Delete.svelte';
	import Edit from './Buttons/Edit.svelte';
	import Reset from './Buttons/Reset.svelte';
	import IncrementDecrement from './Buttons/IncrementDecrement.svelte';
	import { getDateFromHyphenatedString, getDayMonthYearFromDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { getHaveValuesChanged } from '$lib/utils/logs';
	import { currentlyEditing } from '$lib/stores';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import { page } from '$app/stores';
	import { useMutation } from '@sveltestack/svelte-query';
	import axios from 'axios';
	import { getContext } from 'svelte';
	import type { Log_int } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let onDelete: (() => void) | undefined = undefined;
	export let onEdit: (() => void) | undefined = undefined;
	export let onAccept: () => void;
	export let onAddBullet: (() => void) | undefined = undefined;
	export let onReset: (() => void) | undefined = undefined;
	export let incrementDecrementProps:
		| {
				onIncrement: () => void;
				onDecrement: () => void;
				max: number;
				min: number;
		  }
		| undefined = undefined;
	// export let date: Date;
	export let isEditing: boolean;

	export let showIncrementDecrement: boolean = true;
	export let icon: string | undefined = undefined;
	export let lastUpdated: Date | undefined = undefined;
	export let values: Writable<Log_int>;
	export let initialValues: Writable<Log_int>;
	// export let id: string;

	const invalidateLogs: () => void = getContext('invalidateLogs');
	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	export const updateLogMutation = useMutation(
		async (log: Log_int) => await axios.patch('/log', log),
		{
			onSuccess: () => {
				invalidateLogs();
			}
		}
	);

	export const deleteLogMutation = useMutation(
		async () => await axios.delete('/log', { data: { id: $values.id } }),
		{
			onSuccess: () => {
				invalidateLogs();
			}
		}
	);

	export const onCommonAccept: () => void = async () => {
		const haveValuesChanged = getHaveValuesChanged({
			values: $values,
			initialValues: $initialValues
		});

		if (!haveValuesChanged) return ($currentlyEditing = null);

		let logDate: Date = $values.date;

		if ($page.params.date && $page.params.date !== getHyphenatedStringFromDate($values.date)) {
			const currentDate = new Date();
			const _date = new Date(getDateFromHyphenatedString($page.params.date));
			_date.setHours(currentDate.getHours());
			_date.setMinutes(currentDate.getMinutes());
			logDate = _date;
		}

		if ($values.bullets) {
			$values.bullets = $values.bullets.filter((bullet) => bullet);
		}

		$currentlyEditing = null;

		try {
			await $updateLogMutation.mutate({
				...$values,
				lastUpdated: new Date()
			});
		} catch (error) {
			console.log('error updating log');
		}

		onResetNewLogType && onResetNewLogType();
		$initialValues = $values;
		onAccept();
	};

	$: dateValues = getDayMonthYearFromDate($values.date);
	$: lastUpdatedDateValues = lastUpdated && getDayMonthYearFromDate(lastUpdated);
</script>

<div class="w-full hstack">
	<div class="flex flex-wrap place-items-center gap-2 sm:gap-3">
		{#if onAddBullet}
			<AddBullet onClick={onAddBullet} />
		{/if}
		{#if isEditing || (incrementDecrementProps && showIncrementDecrement && $values.time)}
			<IncrementDecrement {...incrementDecrementProps} value={$values.time} />
		{/if}
		{#if isEditing}
			{#if onDelete}
				<Delete iconClass="w-[40px]" {onDelete} />
			{/if}
			<!-- {#if onAccept} -->
			<Accept onAccept={onCommonAccept} />
			<!-- {/if} -->
			{#if onReset}
				<Reset {onReset} />
			{/if}
		{:else if onEdit}
			<Edit {onEdit} />
		{/if}
		<div class="stack">
			<p class="text-xs text-gray-200 text-black">
				{dateValues.hour}:{dateValues.minutes}/{dateValues.string}
			</p>
			{#if lastUpdatedDateValues}
				<p class="text-xs text-gray-300 text-black">
					{lastUpdatedDateValues?.hour}:{lastUpdatedDateValues?.minutes}/{lastUpdatedDateValues?.string}
				</p>
			{/if}
		</div>
	</div>
	<div class="flex-1 flex justify-end items-end">
		{#if icon}
			<Icon {icon} height="20px" class="text-gray-300" />
		{/if}
	</div>
</div>
