<script lang="ts">
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';
	import { clickOutside } from '$lib/utils/clickAway';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import { currentlyEditing, titlesAndReferences } from '$lib/stores';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	export let onConfirmReset: () => void;
	export let id: string;
	export let showDialog = true;
	export let editOnMount = false;
	export const updateLogMutation = useMutation(updateLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
			queryClient.invalidateQueries('allLogNotifications');
		}
	});
	export const deleteLogMutation = useMutation(deleteLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
			queryClient.invalidateQueries('allLogNotifications');
			queryClient.invalidateQueries('filteredLogs');
		}
	});

	onMount(() => {
		if (editOnMount) {
			$currentlyEditing = id;
		}
	});

	export const isEditing = derived(
		[currentlyEditing],
		([$currentlyEditing]) => $currentlyEditing === id
	);

	export const onEdit = () => {
		const isAnotherCardEditing = !!$currentlyEditing;
		if (!isAnotherCardEditing) {
			$currentlyEditing = id;
		}
	};
	export const onDelete = () => {
		$currentlyEditing = null;
		$deleteLogMutation.mutate(id);
	};
	export let changeReferenceInputValue: ((value: string | undefined) => void) | undefined =
		undefined;
	export const onTitleAutoFill = (_title: string) => {
		const correspondingReference = $titlesAndReferences.find((t) => t.title === _title)?.reference;

		changeReferenceInputValue && changeReferenceInputValue(correspondingReference ?? undefined);
	};
	export let onMetaAndEnterKeydown: () => void = () => {};

	let onOpen: () => void;

	const onClickOutside = () => {
		$isEditing && showDialog && onOpen();
	};

	const queryClient = useQueryClient();

	let container: HTMLDivElement;

	onMount(() => {
		const keydown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
				onMetaAndEnterKeydown();
			}
		};

		container.addEventListener('keydown', keydown);

		return () => {
			container.removeEventListener('keydown', keydown);
		};
	});
</script>

<div bind:this={container} use:clickOutside on:click_outside={onClickOutside} class="">
	<slot />
</div>

<ConfirmationDialog onConfirm={onConfirmReset} bind:onOpen
	>Did you want to reset your changes?</ConfirmationDialog
>
