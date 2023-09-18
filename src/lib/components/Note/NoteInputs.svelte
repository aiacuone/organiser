<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import Timestamp from './Timestamp.svelte';

	export let titleInput: HTMLInputElement;
	export let contentInput: HTMLTextAreaElement;
	export let referenceInput: HTMLInputElement;
	export let readOnlyValues: { title: string; content: string; reference: string } | undefined =
		undefined;
	export let timestampData: { date: Date; time: number } | undefined = undefined;
	export let isEditing = false;

	onMount(() => {
		if (readOnlyValues) {
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
			const text = contentInput.value;
			const lines = text.split('\n');
			const currentLineIndex = text.substr(0, cursorPosition).split('\n').length - 1;

			const lineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1;

			if (lines[currentLineIndex].trim() !== '') {
				// Add a new line to the list
				const updatedLine = `• ${lines[currentLineIndex]}`;
				lines[currentLineIndex] = updatedLine;

				// Update textarea value with modified lines
				contentInput.value = lines.join('\n');

				// Adjust cursor position
				textarea.selectionStart = lineStart + 3;
				textarea.selectionEnd = lineStart + 3;
			}
		}

		const keyMethods: Record<string, () => void> = {
			Enter: () => {
				e.preventDefault();
				contentInput.value += '\n';
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

	const showReference = !!readOnlyValues && !readOnlyValues.reference ? false : true;
	const isReadOnlyNote = !!readOnlyValues;
</script>

<div class="{isReadOnlyNote ? 'flex-row' : 'flex-col'} flex relative">
	<input
		placeholder="Title"
		class="outline-0 flex-1 text-xs sm:text-sm resize-none disabled:bg-white font-bold"
		bind:this={titleInput}
		disabled={isReadOnlyNote}
	/>
	<input
		placeholder="Reference"
		class="outline-0 text-opacity-30 text-black text-xs sm:text-sm overflow-x-hidden disabled:bg-white {showReference
			? 'block'
			: 'hidden'} {isReadOnlyNote ? 'text-right' : 'text-left'}"
		bind:this={referenceInput}
		disabled={isReadOnlyNote}
	/>
</div>

{#if !!timestampData}
	<div class="flex-1">
		<div class="hStack gap-2 flex-wrap text-opacity-30 text-black">
			<Timestamp date={timestampData.date} className="flex flex-row gap-1 flex-wrap" />
			<p>{timestampData.time}</p>
		</div>
	</div>
{/if}

<!-- Using tailwind display to conditionally render due to error when updating values -->
<!-- DO NOT TRY TO USE TEXT AREA FOR THIS. had issues with setting height when components mounts, had to use input instead -->
<div class="{isReadOnlyNote ? 'block' : 'hidden'} my-2">
	{#if !!readOnlyValues?.content}
		{#each readOnlyValues?.content.split('\n') as line}
			<div class="flex items-center">
				<span class="text-black text-xs sm:text-sm">{line}</span>
			</div>
		{/each}
	{/if}
</div>

<!-- Using tailwind display to conditionally render due to error when updating values -->
<textarea
	placeholder="Content"
	class="outline-0 w-full text-black text-sm resize-none overflow-x-hidden my-2 disabled:bg-white h-[20px] {isReadOnlyNote
		? 'hidden'
		: 'block'}"
	bind:this={contentInput}
	on:keydown={(e) => contentInput && onKeydown(e, contentInput)}
	on:keyup={() => ($pressedKeys = {})}
	on:input={() => autoExpand(contentInput)}
	disabled={isReadOnlyNote}
	style={`height:${contentInput?.scrollHeight}px`}
/>
