<script lang="ts">
	import { onMount, tick } from 'svelte';

	interface Props {
		value: string | string[];
		className?: string;
		autofocus?: boolean;
		_class?: string;
		onEnterKeydown?: () => void;
		onFocus?: () => void;
		textarea?: HTMLElement;
		isDisabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		onchange?: (e: Event) => void;
	}

	let {
		className,
		autofocus,
		_class,
		onEnterKeydown,
		value = $bindable(''),
		onFocus: _onFocus = $bindable(),
		textarea: bindableTextarea = $bindable(),
		isDisabled = false,
		onclick,
		onchange: _onchange
	}: Props = $props();

	let container: HTMLElement;
	let textarea: HTMLElement;

	const resize = () => {
		textarea.style.height = '20px';
		if (textarea.scrollHeight > 20) textarea.style.height = textarea.scrollHeight + 'px';
	};

	const onchange = (e: Event) => {
		_onchange?.(e);
		resize();
	};

	$effect.pre(() => {
		// This is the same as 'afterUpdate' in SvelteKit
		tick().then(() => resize());
	});

	onMount(() => {
		// Using this because its not accessible within the component when $bindable is being used
		textarea = container.children[0] as HTMLElement;

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
			textarea.removeEventListener('keydown', keydown);
		};
	});

	const onfocus = () => {
		_onFocus && _onFocus();
	};
</script>

<div class="w-full relative" bind:this={container}>
	<textarea
		bind:value
		bind:this={bindableTextarea}
		class="resize-none {className} text-sm center bg-transparent h-[20px] px-2 w-full outline-none {_class}"
		oninput={onchange}
		{onfocus}
		readonly={isDisabled}
		{onclick}
	></textarea>
</div>

<svelte:window onresize={resize} />
