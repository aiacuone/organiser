<script lang="ts">
	import { afterUpdate, getContext, onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';
	export let value: string | string[];
	export let className = '';
	export let autofocus = false;
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

	const onEditLog: (() => void) | undefined = getContext('onEditLog');

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

<div class="w-full relative">
	<textarea
		bind:value
		class="resize-none {className} text-sm center bg-transparent h-[20px] px-2 w-full outline-none {_class}"
		bind:this={textarea}
		on:input={resize}
		on:change={onChange}
	/>
</div>

<svelte:window on:resize={resize} />
