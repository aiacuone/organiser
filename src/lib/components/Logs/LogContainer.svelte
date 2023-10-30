<script lang="ts">
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import { clickOutside } from '$lib/utils/clickAway';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import { titlesAndReferences } from '$lib/stores';
	export let isEditing = false;
	export let onConfirmReset: () => void;
	export let id: string;
	export let showDialog = true;
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
	export let changeReferenceInputValue: ((value: string | undefined) => void) | undefined =
		undefined;

	export const onTitleAutoFill = (_title: string) => {
		const correspondingReference = $titlesAndReferences.find((t) => t.title === _title)?.reference;

		changeReferenceInputValue && changeReferenceInputValue(correspondingReference ?? undefined);
	};

	let onOpen: () => void;

	const onClickOutside = () => {
		isEditing && showDialog && onOpen();
	};

	const queryClient = useQueryClient();
</script>

<div use:clickOutside on:click_outside={onClickOutside} class="">
	<slot />
</div>

<ConfirmationDialog onConfirm={onConfirmReset} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
