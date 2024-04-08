<script lang="ts">
	import { deleteLogClient, updateLogClient } from '$lib/api/logsLocalApi';
	import { clickOutside } from '$lib/utils/clickAway';
	import { useMutation } from '@sveltestack/svelte-query';
	import ConfirmationDialog from '../ConfirmationDialog.svelte';
	import { currentlyEditing, titlesAndReferences } from '$lib/stores';
	import { getContext, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { isADropdownOpen } from '$lib/stores';

	const invalidateLogs: () => void = getContext('invalidateLogs');

	export let onConfirmReset: () => void;
	export let id: string;
	export let showDialog = true;
	export let editOnMount = false;

	export const updateLogMutation = useMutation(updateLogClient, {
		onSuccess: () => {
			invalidateLogs();
		}
	});

	export const deleteLogMutation = useMutation(deleteLogClient, {
		onSuccess: () => {
			invalidateLogs();
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
	export let onControlShitAndEnterKeydown: () => void = () => {};
	export let onControlShitAndDotKeydown: () => void = () => {};

	let onOpen: () => void;

	const onClickOutside = () => {
		$isEditing && showDialog && !$isADropdownOpen && onOpen();
	};

	let container: HTMLDivElement;

	onMount(() => {
		const keydown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
				onControlShitAndEnterKeydown();
			}
			if (e.ctrlKey && e.shiftKey && e.key === '.') {
				onControlShitAndDotKeydown();
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
