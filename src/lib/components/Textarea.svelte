<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	interface Props {
		value: string | string[];
		className?: string;
		autofocus?: boolean;
		_class?: string;
		onEnterKeydown?: () => void;
		onChange?: ChangeEventHandler<HTMLTextAreaElement>;
		onFocus?: () => void;
		textarea?: HTMLElement;
	}

	let {
		className,
		autofocus,
		_class,
		onEnterKeydown,
		onChange,
		value = $bindable(),
		onFocus = $bindable(),
		textarea = $bindable()
	}: Props = $props();

	const resize = () => {
		if (!textarea) return;
		textarea.style.height = '20px';
		if (textarea.scrollHeight > 20) textarea.style.height = textarea.scrollHeight + 'px';
	};

	$effect(() => {
		resize();
	});

	onMount(() => {
		if (!textarea) return;

		autofocus && textarea.focus();

		const keydown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				if (e.metaKey || e.ctrlKey || e.altKey) return;
				e.preventDefault();
				onEnterKeydown && onEnterKeydown();
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
		oninput={resize}
		onchange={onChange}
		onfocus={_onFocus}
	></textarea>
</div>

<svelte:window on:resize={resize} />
