<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import type { Readable } from 'svelte/motion';
	import type { Space_int } from '$lib/types';
	import { updateNote } from '$lib/api/notesLocalApi';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import EditOrAddButtons from './EditOrAddButtons.svelte';
	import NoteInputs from './NoteInputs.svelte';

	export let initialTitleValue: string;
	export let initialContentValue: string;
	export let initialReferenceValue: string;
	export let id: string;
	export let onClickAccept: ({
		title,
		content,
		reference
	}: {
		title: string;
		content: string;
		reference: string;
	}) => void = () => {};
	export let onStopEditing: () => void = () => {};
	export let date: Date;
	export let time: number;
	export let onDeleteNote: () => void;

	// const space: Readable<Space_int> = getContext('space');

	const queryClient = useQueryClient();

	let titleInput: HTMLInputElement;
	let contentInput: HTMLTextAreaElement;
	let referenceInput: HTMLInputElement;

	onMount(() => {
		contentInput.value = initialContentValue;
		titleInput.value = initialTitleValue;
		referenceInput.value = initialReferenceValue;

		titleInput.focus();
	});

	const updateNoteMutation = useMutation(updateNote, {
		onSuccess: (data) => {
			queryClient.setQueryData('spaces', data);
		}
	});

	const _onClickReset = () => {
		titleInput.value = initialTitleValue;
		contentInput.innerText = initialContentValue;
	};

	const onExitEdit = () => {
		titleInput.value = initialTitleValue;
		contentInput.innerText = initialContentValue;
		onStopEditing();
	};

	const _onClickAccept = () => {
		const title = titleInput.value;
		const content = contentInput.value;
		const reference = referenceInput.value;

		// onClickAccept({
		// 	title,
		// 	content,
		// 	reference
		// });
		// $updateNoteMutation.mutate({
		// 	title,
		// 	content,
		// 	reference,
		// 	id,
		// 	space: $space.name,
		// 	time,
		// 	date
		// });
	};

	const onChangeTime = (increaseOrDecrease: 'increase' | 'decrease') => {
		if (time === 0.5 && increaseOrDecrease === 'decrease') return;
		increaseOrDecrease === 'increase' ? (time = time + 0.5) : (time = time - 0.5);
	};
</script>

<NoteContentContainer className="min-h-[110px] relative">
	<NoteInputs
		bind:titleInput
		bind:contentInput
		bind:referenceInput
		timestampData={{ date, time }}
		isEditing
	/>
	<div class="absolute -bottom-[0px] center w-full z-10">
		<EditOrAddButtons
			onClickReset={_onClickReset}
			onAccept={_onClickAccept}
			{time}
			{onChangeTime}
			onClickExit={onExitEdit}
			showExitButton
			onClickDelete={onDeleteNote}
		/>
	</div>
</NoteContentContainer>
