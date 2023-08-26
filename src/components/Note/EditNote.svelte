<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButton from './NoteButton.svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import { onMount } from 'svelte';
	import Timestamp from './Timestamp.svelte';

	export let initialTitleValue: string;
	export let initialContentValue: string;
	export let contentValue: string = '';
	export let titleValue = initialTitleValue;
	export let id: string;
	export let onClickAccept: () => void = () => {};
	export let date: Date;

	const onClickReset = () => {
		titleValue = initialTitleValue;
		contentInput.innerText = initialContentValue;
	};

	const _onClickAccept = () => {
		onClickAccept();
		async function updateNote() {
			await fetch(`/note/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ title: titleValue, content: contentValue, id }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		updateNote();
	};

	let contentInput: HTMLDivElement;
	let titleInput: HTMLDivElement;

	const onInputChange = (e) => {
		contentValue = e.target.innerText;
	};

	onMount(() => {
		contentInput.innerText = initialContentValue;
		titleInput.focus();
	});
</script>

<NoteContentContainer>
	<input
		type="text"
		placeholder="Subject"
		class="outline-0 text-opacity-30 w-full text-black text-sm"
		bind:value={titleValue}
		bind:this={titleInput}
	/>
	<div
		class="w-full outline-0 input break-words text-sm"
		role="textbox"
		contenteditable
		on:input={onInputChange}
		bind:this={contentInput}
	/>
	<Timestamp {date} />
</NoteContentContainer>
<NoteButtonContainer>
	<NoteButton onClick={onClickReset}>
		<Icon icon="system-uicons:reset" height="17px" />
	</NoteButton>
	<NoteButton onClick={_onClickAccept}>
		<Icon icon="mdi:tick" height="17px" />
	</NoteButton>
</NoteButtonContainer>
