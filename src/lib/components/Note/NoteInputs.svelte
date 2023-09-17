<script lang="ts">
	import { editNoteContentInputValue } from '$lib/stores';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let titleInput: HTMLInputElement;
	export let contentInput: HTMLTextAreaElement;
	export let referenceInput: HTMLInputElement;
	export let readOnlyValues: { title: string; content: string; reference: string } | undefined =
		undefined;

	onMount(() => {
		if (readOnlyValues) {
			contentInput.value = readOnlyValues.content;
			titleInput.value = readOnlyValues.title;
			referenceInput.value = readOnlyValues.reference;
		}
	});

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
				textarea === contentInput ? titleInput?.focus() : contentInput?.focus();
			}
		};
		keyMethods[key]?.();
	};

	const autoExpand = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = textarea.scrollHeight + 'px';
	};
</script>

<input
	placeholder="Title"
	class="outline-0 text-opacity-30 w-full text-black text-sm resize-none overflow-x-hidden h-[20px] disabled:bg-white"
	bind:this={titleInput}
	disabled={!!readOnlyValues}
/>
<textarea
	placeholder="Content"
	class="outline-0 w-full text-black text-sm resize-none overflow-x-hidden h-[20px] my-2 disabled:bg-white"
	bind:this={contentInput}
	on:input={() => contentInput && autoExpand(contentInput)}
	on:keydown={(e) => contentInput && onKeydown(e, contentInput)}
	on:keyup={() => ($pressedKeys = {})}
	bind:value={$editNoteContentInputValue}
	disabled={!!readOnlyValues}
/>
<input
	placeholder="Reference"
	class="outline-0 text-opacity-30 w-full text-black text-sm resize-none overflow-x-hidden h-[20px] disabled:bg-white"
	bind:this={referenceInput}
	disabled={!!readOnlyValues}
/>
