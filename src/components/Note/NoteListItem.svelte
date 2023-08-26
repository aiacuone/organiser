<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import EditNote from './EditNote.svelte';
	import Timestamp from './Timestamp.svelte';

	export let title: string;
	export let content: string;
	export let onClickDelete: () => void;
	export let id: string;
	export let date: Date;

	let isEditing = false;
	let editNoteContentValue: string;
	let editNoteTitleValue: string;

	const _onClickEdit = () => {
		isEditing = true;
	};

	const onAcceptEdit = () => {
		isEditing = false;
	};
</script>

<div class="flex-col sm:flex-row center gap-2">
	{#if isEditing}
		<EditNote
			initialTitleValue={title}
			initialContentValue={content}
			{id}
			bind:contentValue={editNoteContentValue}
			bind:titleValue={editNoteTitleValue}
			onClickAccept={onAcceptEdit}
			{date}
		/>
	{:else}
		<NoteContentContainer>
			<p class="text-opacity-20 text-black">{title}</p>
			<p class="bg-white break-words">
				{content}
			</p>
			<Timestamp {date} />
		</NoteContentContainer>
		<NoteButtonContainer>
			<NoteButton onClick={_onClickEdit}>
				<Icon icon="mdi:pencil" height="17px" />
			</NoteButton>
			<NoteButton onClick={onClickDelete}>
				<Icon icon="akar-icons:cross" height="17px" />
			</NoteButton>
		</NoteButtonContainer>
	{/if}
</div>
