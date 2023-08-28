<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import NoteContentContainer from './NoteContentContainer.svelte';
	import NoteButton from './NoteButton.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { editNoteContentInputValue } from '$lib/stores';

	export let background: string;
	export let onClickAccept: () => void;
	export let titleValue: string;

	// used this because bind the value of the element is causing issues
	let titleInput: HTMLInputElement;
	let contentInput: HTMLTextAreaElement;

	const onClickReset = () => {
		contentInput.innerText = '';
		titleInput.value = '';
	};

	const onAccept = () => {
		onClickAccept();
		titleValue = $editNoteContentInputValue = '';
		contentInput.style.height = '20px';
	};

	const pressedKeys: Writable<Record<string, boolean>> = writable({});

	const onKeydown = (e: KeyboardEvent, textarea: HTMLTextAreaElement) => {
		const key = e.key;
		$pressedKeys[key] = true;

		// ⌘ + 8
		if ($pressedKeys['Meta'] && $pressedKeys['8']) {
			e.preventDefault(); // Prevent the default Enter behavior

			const cursorPosition = textarea.selectionStart;
			const text = $editNoteContentInputValue;
			const lines = text.split('\n');
			const currentLineIndex = text.substr(0, cursorPosition).split('\n').length - 1;

			const lineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1;

			if (lines[currentLineIndex].trim() !== '') {
				// Add a new line to the list
				const updatedLine = `• ${lines[currentLineIndex]}`;
				lines[currentLineIndex] = updatedLine;

				// Update textarea value with modified lines
				$editNoteContentInputValue = lines.join('\n');

				// Adjust cursor position
				textarea.selectionStart = lineStart + 3;
				textarea.selectionEnd = lineStart + 3;
			}
		}

		const keyMethods: Record<string, () => void> = {
			Enter: () => {
				e.preventDefault();
				$editNoteContentInputValue += '\n';
				textarea.style.height = textarea.scrollHeight + 'px';
			},
			ArrowUp: () => {
				// e.preventDefault();
			},
			ArrowDown: () => {
				// e.preventDefault();
			},
			Tab: () => {
				e.preventDefault();
				textarea === contentInput ? titleInput.focus() : contentInput.focus();
			}
		};
		keyMethods[key]?.();
	};

	const autoExpand = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = textarea.scrollHeight + 'px';
	};
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-2 w-full rounded-sm"
	style="background:{background}"
>
	<NoteContentContainer>
		<input
			placeholder="Title"
			class="outline-0 text-opacity-30 w-full text-black text-sm resize-none overflow-x-hidden h-[20px]"
			bind:this={titleInput}
			bind:value={titleValue}
		/>
		<textarea
			placeholder="Content"
			class="outline-0 w-full text-black text-sm resize-none overflow-x-hidden h-[20px]"
			bind:this={contentInput}
			on:input={() => autoExpand(contentInput)}
			on:keydown={(e) => onKeydown(e, contentInput)}
			on:keyup={() => ($pressedKeys = {})}
			bind:value={$editNoteContentInputValue}
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
