<script lang="ts">
	import Accept from './Buttons/Accept.svelte';
	import AddBullet from './Buttons/AddBullet.svelte';
	import Delete from './Buttons/Delete.svelte';
	import Edit from './Buttons/Edit.svelte';
	import Reset from './Buttons/Reset.svelte';
	import IncrementDecrement from './Buttons/IncrementDecrement.svelte';
	import { getDayMonthYearFromDate } from '$lib/utils';
	import Icon from '@iconify/svelte';

	export let onDelete: (() => void) | undefined = undefined;
	export let onEdit: (() => void) | undefined = undefined;
	export let onAccept: (() => void) | undefined = undefined;
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
	export let date: Date;
	export let isEditing: boolean;
	export let incrementDecrementValue: number | undefined = undefined;
	export let showIncrementDecrement: boolean = true;
	export let icon: string | undefined = undefined;
	export let lastUpdated: Date | undefined = undefined;

	$: dateValues = getDayMonthYearFromDate(date);
	$: lastUpdatedDateValues = lastUpdated && getDayMonthYearFromDate(lastUpdated);
</script>

<div class="w-full hstack">
	<div class="flex flex-wrap place-items-center gap-2 sm:gap-3">
		{#if onAddBullet}
			<AddBullet onClick={onAddBullet} />
		{/if}
		{#if isEditing || (incrementDecrementProps && showIncrementDecrement && incrementDecrementValue)}
			<IncrementDecrement {...incrementDecrementProps} value={incrementDecrementValue} />
		{/if}
		{#if isEditing}
			{#if onDelete}
				<Delete iconClass="w-[40px]" {onDelete} />
			{/if}
			{#if onAccept}
				<Accept {onAccept} />
			{/if}
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
			<Icon {icon} height="30px" class="text-gray-300" />
		{/if}
	</div>
</div>
