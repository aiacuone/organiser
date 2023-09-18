<script lang="ts">
	import NoteContentContainer from './NoteContentContainer.svelte';
	import EditOrAddButtons from './EditOrAddButtons.svelte';
	import NoteInputs from './NoteInputs.svelte';

	export let background: string;
	export let onClickAccept: ({
		title,
		time,
		reference,
		content
	}: {
		title: string;
		time: number;
		reference: string;
		content: string;
	}) => void;

	export let time: number = 0.5;

	let titleInput: HTMLInputElement;
	let contentInput: HTMLTextAreaElement;
	let referenceInput: HTMLInputElement;

	const onClickReset = () => {
		contentInput.value = '';
		titleInput.value = '';
		referenceInput.value = '';
	};

	const onAccept = () => {
		onClickAccept({
			title: titleInput.value,
			content: contentInput.value,
			reference: referenceInput.value,
			time
		});
		titleInput.value = contentInput.value = referenceInput.value = '';
		contentInput.style.height = '20px';
		time = 0.5;
	};

	const onChangeTime = (increaseOrDecrease: 'increase' | 'decrease') => {
		if (time === 0.5 && increaseOrDecrease === 'decrease') return;
		increaseOrDecrease === 'increase' ? (time = time + 0.5) : (time = time - 0.5);
	};
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-1 w-full rounded-md"
	style="background:{background}"
>
	<NoteContentContainer>
		<NoteInputs bind:titleInput bind:contentInput bind:referenceInput />
		<EditOrAddButtons {onClickReset} {onAccept} {time} {onChangeTime} />
	</NoteContentContainer>
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
