<script lang="ts">
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import { clickOutside } from '$lib/utils/clickAway';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	export let isEditing = false;
	export let onConfirmReset: () => void;
	export let id: string;
	export const updateLogMutation = useMutation(updateLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
		}
	});
	export const deleteLogMutation = useMutation(deleteLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
		}
	});
	export const onEdit = () => {
		isEditing = true;
	};
	export const onDelete = () => {
		isEditing = false;
		$deleteLogMutation.mutate(id);
	};

	let onOpen: () => void;

	const onClickOutside = () => {
		isEditing && onOpen();
	};

	const queryClient = useQueryClient();
</script>

<div use:clickOutside on:click_outside={onClickOutside} class="shadow-md">
	<slot />
</div>

<ConfirmationDialog onConfirm={onConfirmReset} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
