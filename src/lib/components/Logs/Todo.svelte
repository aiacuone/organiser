<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import BottomOptions from './BottomOptions.svelte';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';

	export let isChecked = false;

	const onCheckboxClick = () => {
		isChecked = !isChecked;
	};

	const onEdit = () => {
		console.log('edit');
	};

	const onDelete = () => {
		console.log('delete');
	};

	let onOpen: () => void;

	const date = 'Friday, 12/5/23, 10:23AM';
</script>

<div class="border-dashed border-neutral-200 border px-3 py-4 stack gap-4">
	<div class="hstack gap-4 items-center">
		<Icon icon={icons.todo} height="30px" class="opacity-10" />
		<button on:click={onOpen} class="center border-2 border-gray-400 w-[35px] h-full rounded-md">
			{#if isChecked}
				<Icon icon={icons.tickBold} height="20px" color="#32ed65" class="text-green" />
			{/if}
		</button>
		<p class="text-sm">Ask things to do stuff</p>
	</div>
	<BottomOptions {onEdit} {onDelete} {date} />
</div>

<ConfirmationDialog bind:onOpen onConfirm={onCheckboxClick}>Are you sure?</ConfirmationDialog>
