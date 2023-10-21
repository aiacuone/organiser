<script lang="ts">
	import { onMount } from 'svelte';

	export let value: string;
	export let className = '';

	const resize = () => {
		console.log({ height: textarea.scrollHeight });
		if (textarea.scrollHeight > 30) {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		}
	};

	onMount(() => {
		resize();

		if (textarea.scrollHeight < 50) {
			return (textarea.style.height = '20px');
		}

		const preventEnter = (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
			}
		};

		textarea.addEventListener('keydown', preventEnter);

		return () => {
			textarea.removeEventListener('keydown', preventEnter);
		};
	});

	let textarea: HTMLTextAreaElement;
</script>

<textarea
	{value}
	class="resize-none {className} w-full text-sm center bg-transparent"
	bind:this={textarea}
	on:input={resize}
/>
