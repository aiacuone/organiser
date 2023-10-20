<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Button from '$lib/components/Button.svelte';

	export let iconClass = '';
	export let onConfirmDelete: (() => void) | undefined = () => {
		onClose();
	};

	let onOpen: () => void;
	let onClose: () => void;
</script>

<CommonLogButton onClick={onOpen}>
	<Icon icon={icons.delete} height="20px" class="opacity-30 {iconClass}" />
</CommonLogButton>

<Dialog bind:onOpen bind:onClose>
	<div class="hstack gap-3">
		Are you sure you want to delete?
		<Button onClick={onConfirmDelete}>Yes</Button>
		<Button onClick={onClose}>No</Button>
	</div>
</Dialog>
