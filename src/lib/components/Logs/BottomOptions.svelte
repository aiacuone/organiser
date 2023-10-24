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

	const { string: dateString, minutes, hour } = getDayMonthYearFromDate(date);
</script>

<div class="w-full hstack">
	<div class="grid grid-cols-2 sm:grid-cols-4 place-items-center justify-center gap-3">
		<p class="text-xs text-opacity-30 text-black">
			{hour}:{minutes}/{dateString}
		</p>
		{#if onAddBullet}
			<AddBullet onClick={onAddBullet} />
		{/if}
		{#if incrementDecrementProps && showIncrementDecrement && incrementDecrementValue}
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
	</div>
	<div class="flex-1 flex justify-end items-end">
		{#if icon}
			<Icon {icon} height="30px" class="opacity-10" />
		{/if}
	</div>
</div>
