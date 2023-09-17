<script lang="ts">
	import NoteContentContainer from './NoteContentContainer.svelte';
	import { editNoteContentInputValue } from '$lib/stores';
	import EditOrAddButtons from './EditOrAddButtons.svelte';
	import NoteInputs from './NoteInputs.svelte';

	export let background: string;
	export let onClickAccept: ({
		title,
		time,
		reference
	}: {
		title: string;
		time: number;
		reference: string;
	}) => void;

	export let time: number = 0.5;

	// used this because bind the value of the element is causing issues
	let titleInput: HTMLInputElement;
	let contentInput: HTMLTextAreaElement;
	let referenceInput: HTMLInputElement;

	const onClickReset = () => {
		contentInput.innerText = '';
		titleInput.value = '';
		referenceInput.value = '';
	};

	const onAccept = () => {
		onClickAccept({ title: titleInput.value, time, reference: referenceInput.value });
		titleInput.value = $editNoteContentInputValue = referenceInput.value = '';
		contentInput.style.height = '20px';
		time = 0.5;
	};

	const onChangeTime = (increaseOrDecrease: 'increase' | 'decrease') => {
		if (time === 0.5 && increaseOrDecrease === 'decrease') return;
		increaseOrDecrease === 'increase' ? (time = time + 0.5) : (time = time - 0.5);
	};
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-2 w-full rounded-sm"
	style="background:{background}"
>
	<NoteContentContainer>
		<NoteInputs bind:titleInput bind:contentInput bind:referenceInput />
	</NoteContentContainer>
	<EditOrAddButtons {onClickReset} {onAccept} {time} {onChangeTime} />
</div>

<style>
	::placeholder {
		/* Chrome, Firefox, Opera, Safari 10.1+ */
		color: #00000040;
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: #00000040;
	}

	::-ms-input-placeholder {
		/* Microsoft Edge */
		color: #00000040;
	}
</style>
