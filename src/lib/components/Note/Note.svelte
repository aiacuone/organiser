<script lang="ts">
	import Icon from '@iconify/svelte';
	import EditNote from './EditNote.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import Button from '../Button.svelte';
	import { onMount } from 'svelte';
	import TimestampAndTime from './TimestampAndTime.svelte';
	import NoteInputs from './NoteInputs.svelte';

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

	let contentInput: HTMLTextAreaElement;
	onMount(() => {
		contentInput.style.height = contentInput.scrollHeight + 'px';
	});
</script>

<div class="flex-col sm:flex-row center gap-2">
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
				<NoteInputs readOnlyValues={{ title, content, reference }} bind:contentInput />
				<div class="pt-3">
					<TimestampAndTime {date} {time} />
				</div>
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
