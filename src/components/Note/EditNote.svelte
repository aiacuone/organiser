<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButton from './NoteButton.svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import { onMount } from 'svelte';

	export let initialSubjectValue: string;
	export let initialContentValue: string;
	export let contentValue: string = '';
	export let subjectValue = initialSubjectValue;
	export let id: string;
	export let onClickAccept: () => void = () => {};

	const onClickReset = () => {
		subjectValue = initialSubjectValue;
		contentInput.innerText = initialContentValue;
	};

	const _onClickAccept = () => {
		onClickAccept();
		console.log('accept edit', { subjectValue, contentValue, id, date: new Date() });
	};

	let contentInput: HTMLDivElement;
	let subjectInput: HTMLDivElement;

	const onInputChange = (e) => {
		contentValue = e.target.innerText;
	};

	onMount(() => {
		contentInput.innerText = initialContentValue;
		subjectInput.focus();
	});
</script>

<NoteContentContainer>
	<input
		type="text"
		placeholder="Subject"
		class="outline-0 text-opacity-30 w-4/12 text-black text-sm"
		bind:value={subjectValue}
		bind:this={subjectInput}
	/>
	<div
		class="w-full outline-0 input flex items-center break-normal text-sm"
		role="textbox"
		contenteditable
		on:input={onInputChange}
		bind:this={contentInput}
	/>
</NoteContentContainer>
<NoteButtonContainer>
	<NoteButton onClick={onClickReset}>
		<Icon icon="system-uicons:reset" height="17px" />
	</NoteButton>
	<NoteButton onClick={_onClickAccept}>
		<Icon icon="mdi:tick" height="17px" />
	</NoteButton>
</NoteButtonContainer>
