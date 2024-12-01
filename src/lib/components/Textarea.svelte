<script lang="ts">
	import { onMount, tick } from 'svelte';

	interface Props {
		value: string | string[];
		className?: string;
		autofocus?: boolean;
		_class?: string;
		onEnterKeydown?: () => void;
		onchange: (e: Event) => void;
		onFocus?: () => void;
		textarea?: HTMLElement;
		isDisabled?: boolean;
		onclick?: () => void;
	}

	let {
		className,
		autofocus,
		_class,
		onEnterKeydown,
		onchange: _onchange,
		value = $bindable(''),
		onFocus = $bindable(),
		textarea = $bindable(),
		isDisabled = false,
		onclick
	}: Props = $props();

	const resize = () => {
		if (!textarea) return;
		textarea.style.height = '20px';
		if (textarea.scrollHeight > 20) textarea.style.height = textarea.scrollHeight + 'px';
	};

	const onchange = (e: Event) => {
		_onchange(e);
		resize();
	};

	$effect.pre(() => {
		// This is the same as 'afterUpdate' in SvelteKit
		tick().then(() => resize());
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
		bind:this={textarea}
		class="resize-none {className} text-sm center bg-transparent h-[20px] px-2 w-full outline-none {_class}"
		oninput={onchange}
		onfocus={_onFocus}
		disabled={isDisabled}
		{onclick}
	></textarea>
</div>

<svelte:window onresize={resize} />
