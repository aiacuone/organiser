<script lang="ts">
	import { clickOutside } from '$lib/utils/clickAway';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	export let isEditing = false;
	export let onConfirmReset: () => void;

	let onOpen: () => void;

	const onClickOutside = () => {
		isEditing && onOpen();
	};
</script>

<div use:clickOutside on:click_outside={onClickOutside} class="shadow-md">
	<slot />
</div>

<ConfirmationDialog onConfirm={onConfirmReset} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
