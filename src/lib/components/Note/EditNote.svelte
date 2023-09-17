<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import type { Readable } from 'svelte/motion';
	import type { Space_int } from '$lib/types';
	import { updateNote } from '$lib/api/notesLocalApi';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
	import TimestampAndTime from './TimestampAndTime.svelte';
	import EditOrAddButtons from './EditOrAddButtons.svelte';

	export let initialTitleValue: string;
	export let initialContentValue: string;
	export let contentValue: string = initialContentValue;
	export let titleValue = initialTitleValue;
	export let id: string;
	export let onClickAccept: () => void = () => {};
	export let onClickReset: () => void = () => {};
	export let date: Date;
	export let time: number;
	export let referenceValue: string;

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
			space: $space.name,
			time,
			date,
			reference: referenceValue
		});
	};

	let contentInput: HTMLDivElement;
	let titleInput: HTMLDivElement;
	let referenceInput: HTMLDivElement;

	const onInputChange = (e) => {
		contentValue = e.target.innerText;
	};

	onMount(() => {
		contentInput.innerText = initialContentValue;
		titleInput.focus();
	});

	const onChangeTime = (increaseOrDecrease: 'increase' | 'decrease') => {
		if (time === 0.5 && increaseOrDecrease === 'decrease') return;
		increaseOrDecrease === 'increase' ? (time = time + 0.5) : (time = time - 0.5);
	};
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
	<div class="pt-3">
		<TimestampAndTime {date} {time} />
	</div>
	<input
		type="text"
		placeholder="Reference"
		class="outline-0 text-opacity-30 w-full text-black text-sm"
		bind:value={referenceValue}
		bind:this={referenceInput}
	/>
</NoteContentContainer>
<EditOrAddButtons onClickReset={_onClickReset} onAccept={_onClickAccept} {time} {onChangeTime} />
