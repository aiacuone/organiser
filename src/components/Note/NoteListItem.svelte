<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import EditNote from './EditNote.svelte';
	import { getDayMonthYearFromDate } from '../../utils';

	export let subject: string;
	export let content: string;
	export let onClickEdit: () => void;
	export let onClickDelete: () => void;
	export let id: string;
	export let date: Date;

	let isEditing = false;
	let editNoteContentValue: string;
	let editNoteSubjectValue: string;

	$: ({ dayString, day, month, year, hour, minutes } = getDayMonthYearFromDate(date));

	const _onClickEdit = () => {
		onClickEdit();
		isEditing = true;
	};

	const onAcceptEdit = () => {
		isEditing = false;
	};
</script>

<div class="flex-col sm:flex-row center gap-2">
	{#if isEditing}
		<EditNote
			initialSubjectValue={subject}
			initialContentValue={content}
			{id}
			bind:contentValue={editNoteContentValue}
			bind:subjectValue={editNoteSubjectValue}
			onClickAccept={onAcceptEdit}
		/>
	{:else}
		<NoteContentContainer>
			<p class="text-opacity-20 text-black">{subject}</p>
			<p class="bg-white flex items-center">
				{content}
			</p>
			<div class="hStack text-xs text-opacity-20 text-black gap-2 pt-5">
				<p>{dayString}</p>
				<p>{`${day}-${month}-${year}`}</p>
				<p>{`${hour}:${minutes}`}</p>
			</div>
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
