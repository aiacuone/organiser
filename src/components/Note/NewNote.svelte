<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButton from './NoteButton.svelte';

	export let background: string;
	export let onClickAccept: () => void;
	export let contentValue: string;
	export let subjectValue: string;

	// used this because bind the value of the element is causing issues
	let contentInput: HTMLDivElement;

	const onInputChange = (e) => {
		contentValue = e.target.innerText;
	};

	const onClickReset = () => {
		contentInput.innerText = '';
		subjectValue = '';
	};

	const _onClickAccept = () => {
		onClickAccept();
		contentInput.innerText = '';
		subjectValue = '';
	};
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-2 w-full rounded-md"
	style="background:{background}"
>
	<NoteContentContainer>
		<input
			type="text"
			placeholder="Subject"
			class="outline-0 text-opacity-30 w-full text-black text-sm"
			bind:value={subjectValue}
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
