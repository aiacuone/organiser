<script lang="ts">
	import Icon from '@iconify/svelte';
	import EditNote from './EditNote.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import Button from '../Button.svelte';
	import { onMount } from 'svelte';
	import NoteInputs from './NoteInputs.svelte';
	import { icons } from '$lib/general/icons';

	export let title: string;
	export let content: string;
	export let onConfirmDelete: () => void;
	export let id: string;
	export let date: Date;
	export let time: number;
	export let reference: string;

	let isEditing = false;
	let isConfirmingDelete = false;

	const onStopEditing = () => {
		isEditing = false;
	};

	const onClickEdit = () => {
		isEditing = true;
	};

	const onClickDelete = () => {
		isConfirmingDelete = true;
	};

	const _onConfirmDelete = () => {
		onConfirmDelete();
		isConfirmingDelete = false;
	};

	const onAcceptEdit = ({
		title: _title,
		content: _content,
		reference: _reference
	}: {
		title: string;
		content: string;
		reference: string;
	}) => {
		isEditing = false;
		title = _title;
		content = _content;
		reference = _reference;
	};

	// Not all these are used, shows error if not included
	let titleInput: HTMLInputElement;
	let contentInput: HTMLTextAreaElement;
	let referenceInput: HTMLInputElement;

	onMount(() => {
		contentInput.style.height = contentInput.scrollHeight + 'px';
	});

	let containerHeight: number;
</script>

<div class="flex-col sm:flex-row center gap-1" bind:clientHeight={containerHeight}>
	{#if isEditing}
		<EditNote
			initialTitleValue={title}
			initialContentValue={content}
			initialReferenceValue={reference}
			{id}
			onClickAccept={onAcceptEdit}
			{date}
			onClickReset={onStopEditing}
			{time}
		/>
	{:else}
		<NoteContentContainer style={`height:${containerHeight}px`}>
			{#if isConfirmingDelete}
				<div class="gap-3 w-full center stack h-full">
					<p>Are you sure you want to delete</p>
					<div class="hStack gap-3">
						<Button onClick={_onConfirmDelete}>Yes</Button>
						<Button onClick={() => (isConfirmingDelete = false)}>No</Button>
					</div>
				</div>
			{:else}
				<NoteInputs
					readOnlyValues={{ title, content, reference }}
					bind:titleInput
					bind:contentInput
					bind:referenceInput
					timestampData={{ date, time }}
					{onClickEdit}
					{onClickDelete}
				/>
			{/if}
		</NoteContentContainer>
	{/if}
</div>
