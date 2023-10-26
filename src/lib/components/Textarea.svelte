<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	export let value: string | string[];
	export let className = '';
	export let autofocus = false;
	export let isDisabled = false;

	let textarea: HTMLTextAreaElement;
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

		const preventEnter = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
			}
		};

		textarea.addEventListener('keydown', preventEnter);

		return () => {
			textarea.removeEventListener('keydown', preventEnter);
		};
	});
</script>

<textarea
	bind:value
	class="resize-none {className} w-full text-sm center bg-transparent h-[20px]"
	bind:this={textarea}
	on:input={resize}
	disabled={isDisabled}
/>

<svelte:window on:resize={resize} />
