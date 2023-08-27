<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getContext, onMount } from 'svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import Timestamp from './Timestamp.svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import type { Readable } from 'svelte/motion';
	import type { Space_int } from '$lib/types';
	import { updateNote } from '$lib/api/notesLocalApi';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';

	export let initialTitleValue: string;
	export let initialContentValue: string;
	export let contentValue: string = initialContentValue;
	export let titleValue = initialTitleValue;
	export let id: string;
	export let onClickAccept: () => void = () => {};
	export let onClickReset: () => void = () => {};
	export let date: Date;

	const space: Readable<Space_int> = getContext('space');

	const queryClient = useQueryClient();

	const updateNoteMutation = useMutation(updateNote, {
		onSuccess: (data) => {
			queryClient.setQueryData('spaces', data);
		}
	});

	const _onClickReset = () => {
		titleValue = initialTitleValue;
		contentInput.innerText = initialContentValue;
		onClickReset();
	};

	const _onClickAccept = () => {
		onClickAccept();
		$updateNoteMutation.mutate({
			id,
			title: titleValue,
			content: contentValue,
			space: $space.name
		});
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

<NoteContentContainer className="min-h-[110px]">
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
	<NoteButton onClick={_onClickReset}>
		<Icon icon="system-uicons:reset" height="17px" />
	</NoteButton>
	<NoteButton onClick={_onClickAccept}>
		<Icon icon="mdi:tick" height="17px" />
	</NoteButton>
</NoteButtonContainer>
