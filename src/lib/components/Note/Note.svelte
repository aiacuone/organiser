<script lang="ts">
	import EditNote from './EditNote.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import Button from '../Button.svelte';
	import { getContext, onMount } from 'svelte';
	import NoteInputs from './NoteInputs.svelte';
	import NoteButton from './NoteButton.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import type { Readable } from 'svelte/store';
	import type { Space_int } from '$lib/types';

	export let title: string;
	export let content: string;
	export let onConfirmDelete: () => void;
	export let id: string;
	export let date: Date;
	export let time: number;
	export let reference: string;

	const space: Readable<Space_int> = getContext('space');

	let isEditing = false;
	let isConfirmingDelete = false;
	let containerHeight: number;
	let showMoreButtons = false;

	const onStopEditing = () => {
		isEditing = false;
		showMoreButtons = false;
	};

	const onClickEdit = () => {
		isEditing = true;
		showMoreButtons = false;
	};

	const onClickDelete = () => {
		isConfirmingDelete = true;
		showMoreButtons = false;
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
</script>

<div class="flex-col sm:flex-row center gap-1 relative" bind:clientHeight={containerHeight}>
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
				/>
			{/if}

			<div class="z-10 w-full center">
				{#if showMoreButtons}
					<div class="absolute -bottom-3">
						<div class="hStack gap-2">
							<NoteButton onClick={onClickEdit}>
								<Icon icon={icons.edit} height="17px" />
							</NoteButton>
							<NoteButton onClick={onClickDelete}>
								<Icon icon={icons.delete} height="17px" />
							</NoteButton>
						</div>
					</div>
				{:else}
					<div class="-bottom-3 absolute">
						<button
							on:click={() => (showMoreButtons = true)}
							style="background:{$space.color}"
							class="px-1 rounded-sm"
						>
							<Icon icon={icons.moreHorizontal} width="20px" color="black" />
						</button>
					</div>
				{/if}
			</div>
		</NoteContentContainer>
	{/if}
</div>
