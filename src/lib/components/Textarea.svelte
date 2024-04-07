<script lang="ts">
	import { afterUpdate, getContext, onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';
	export let value: string | string[];
	export let className = '';
	export let autofocus = false;
	export let _class = '';
	export let onEnterKeydown: () => void = () => {};
	export let onChange: ChangeEventHandler<HTMLTextAreaElement> = () => {};
	export let textarea: HTMLElement | undefined = undefined;
	export let onFocus: (() => void) | undefined = undefined;
	const resize = () => {
		if (!textarea) return;
		textarea.style.height = '20px';
		if (textarea.scrollHeight > 20) textarea.style.height = textarea.scrollHeight + 'px';
	};

	afterUpdate(() => {
		resize();
	});

	onMount(() => {
		if (!textarea) return;

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
			if (!textarea) return;
			textarea.removeEventListener('keydown', keydown);
		};
	});

	const _onFocus = () => {
		onFocus && onFocus();
	};
</script>

<div class="w-full relative">
	<textarea
		bind:value
		class="resize-none {className} text-sm center bg-transparent h-[20px] px-2 w-full outline-none {_class}"
		bind:this={textarea}
		on:input={resize}
		on:change={onChange}
		on:focus={_onFocus}
	/>
</div>

<svelte:window on:resize={resize} />
