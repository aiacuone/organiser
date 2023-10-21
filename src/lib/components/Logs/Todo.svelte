<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import BottomOptions from './BottomOptions.svelte';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	export let date: Date;
	export let content: string | string[];
	export let id: string;
	export let priority: number;
	export let isChecked: boolean;

	const onCheckboxClick = () => {
		isChecked = !isChecked;
	};

	const onEdit = () => {
		console.log('edit', id);
	};

	const onDelete = () => {
		console.log('delete', id);
	};

	let onOpen: () => void;
</script>

<div class="border-dashed border-neutral-200 border px-3 py-4 stack gap-4">
	<div class="hstack gap-4 items-center">
		<IconWithRating icon={icons.todo} rating={priority} />
		<button on:click={onOpen} class="center border-2 border-gray-400 w-[35px] h-full rounded-md">
			{#if isChecked}
				<Icon icon={icons.tickBold} height="20px" color="#32ed65" class="text-green" />
			{/if}
		</button>
		<p class="text-sm">{content}</p>
	</div>
	<BottomOptions {onEdit} {onDelete} {date} />
</div>

<ConfirmationDialog bind:onOpen onConfirm={onCheckboxClick}>Are you sure?</ConfirmationDialog>
