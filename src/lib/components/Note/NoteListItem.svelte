<script lang="ts">
	import Icon from '@iconify/svelte';
	import EditNote from './EditNote.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import Timestamp from './Timestamp.svelte';
	import Button from '../Button.svelte';
	import { onMount } from 'svelte';

	export let title: string;
	export let content: string;
	export let onConfirmDelete: () => void;
	export let id: string;
	export let date: Date;

	let isEditing = false;
	let editNoteContentValue: string;
	let editNoteTitleValue: string;
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

	let contentTextarea: HTMLTextAreaElement;
	onMount(() => {
		contentTextarea.style.height = contentTextarea.scrollHeight + 'px';
	});
</script>

<div class="flex-col sm:flex-row center gap-2">
	{#if isEditing}
		<EditNote
			initialTitleValue={title}
			initialContentValue={content}
			{id}
			bind:contentValue={editNoteContentValue}
			bind:titleValue={editNoteTitleValue}
			onClickAccept={onStopEditing}
			{date}
			onClickReset={onStopEditing}
		/>
	{:else}
		<NoteContentContainer className="min-h-[110px]">
			{#if isConfirmingDelete}
				<div class="gap-3 w-full center stack">
					<p>Are you sure you want to delete</p>
					<div class="hStack gap-3">
						<Button onClick={_onConfirmDelete}>Yes</Button>
						<Button onClick={() => (isConfirmingDelete = false)}>No</Button>
					</div>
				</div>
			{:else}
				<p class="text-opacity-20 text-black">{title}</p>
				<textarea
					disabled
					class="outline-0 w-full text-black text-sm resize-none overflow-x-hidden h-[20px] bg-white"
					value={content}
					bind:this={contentTextarea}
				/>
				<Timestamp {date} />
			{/if}
		</NoteContentContainer>
		<NoteButtonContainer>
			<NoteButton onClick={onClickEdit}>
				<Icon icon="mdi:pencil" height="17px" />
			</NoteButton>
			<NoteButton onClick={onClickDelete}>
				<Icon icon="akar-icons:cross" height="17px" />
			</NoteButton>
		</NoteButtonContainer>
	{/if}
</div>
