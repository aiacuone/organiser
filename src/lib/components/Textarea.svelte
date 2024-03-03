<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';
	export let value: string | string[];
	export let className = '';
	export let autofocus = false;
	export let isDisabled = false;
	export let _class = '';
	export let onEnterKeydown: () => void = () => {};
	export let onChange: ChangeEventHandler<HTMLTextAreaElement> = () => {};

	let textarea: HTMLTextAreaElement;
	export const onFocus = () => {
		textarea.focus();
	};
	const resize = () => {
		if (!textarea) return;
		textarea.style.height = '20px';
		if (textarea.scrollHeight > 20) textarea.style.height = textarea.scrollHeight + 'px';
	};

	afterUpdate(() => {
		resize();
	});

	onMount(() => {
		autofocus && textarea.focus();

		const keydown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				if (e.metaKey || e.ctrlKey || e.altKey) return;
				e.preventDefault();
				onEnterKeydown();
			}
		};

		textarea.addEventListener('keydown', keydown);

		return () => {
			textarea.removeEventListener('keydown', keydown);
		};
	});
</script>

<textarea
	bind:value
	class="resize-none {className} text-sm center bg-transparent h-[20px] px-2 {_class}"
	bind:this={textarea}
	on:input={resize}
	disabled={isDisabled}
	on:change={onChange}
/>

<svelte:window on:resize={resize} />
