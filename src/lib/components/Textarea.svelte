<script lang="ts">
	import { onMount } from 'svelte';
	export let value: string | string[];
	export let className = '';
	export let autofocus = false;
	export let isDisabled = false;

	let textarea: HTMLTextAreaElement;
	const resize = () => {
		if (textarea.scrollHeight === 40) {
			textarea.style.height = '20px';
		}
		if (textarea.scrollHeight > 30) {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		}
	};

	onMount(() => {
		resize();
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
	class="resize-none {className} w-full text-sm center bg-transparent"
	bind:this={textarea}
	on:input={resize}
	disabled={isDisabled}
/>

<svelte:window on:resize={resize} />
