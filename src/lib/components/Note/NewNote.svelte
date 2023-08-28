<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let background: string;
	export let onClickAccept: () => void;
	export let contentValue: string;

	// used this because bind the value of the element is causing issues
	let titleInput: HTMLInputElement;
	let contentInput: HTMLDivElement;

	const onInputChange = (e) => {
		contentValue = e.target.innerText;
	};

	const onClickReset = () => {
		contentInput.innerText = '';
		titleInput.value = '';
	};

	const onAccept = () => {
		onClickAccept();
		contentInput.innerText = '';
		titleInput.value = '';
	};

	onMount(() => {
		const onKeyDown = (e) => {
			const test = document.getElementById('new-note-title-input');
			const key = e.key;
			const keyMethods: Record<string, () => void> = {
				Enter: () => {
					onAccept();
				},
				ArrowUp: () => {
					titleInput.focus();
				},
				ArrowDown: () => {
					contentInput.focus();
				},
				Tab: () => {
					e.preventDefault();
					document.activeElement === titleInput ? contentInput.focus() : titleInput.focus();
				}
			};
			keyMethods[key]?.();
		};

		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-2 w-full rounded-sm"
	style="background:{background}"
>
	<NoteContentContainer>
		<input
			id="new-note-title-input"
			type="text"
			placeholder="Title"
			class="outline-0 text-opacity-30 w-full text-black text-sm"
			bind:this={titleInput}
		/>
		<div
			id="new-note-content-input"
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
		<NoteButton onClick={onAccept}>
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
