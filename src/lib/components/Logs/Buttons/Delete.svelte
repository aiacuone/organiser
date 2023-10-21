<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	export let onDelete: () => void;
	export let iconClass = '';
	export let onConfirmDelete: () => void = () => {
		onDelete();
	};

	let onOpen: () => void;
</script>

<CommonLogButton onClick={onOpen}>
	<Icon icon={icons.delete} height="20px" class="opacity-30 {iconClass}" />
</CommonLogButton>

<ConfirmationDialog bind:onOpen onConfirm={onConfirmDelete}
	>Are you sure you want to delete?</ConfirmationDialog
>
