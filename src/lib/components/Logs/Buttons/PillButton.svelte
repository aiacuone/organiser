<script lang="ts">
	import Icon from '@iconify/svelte';

	// NOTE: this component is to be refactored once Svelte 5.0 releases. Use snippets to pass in buttons and their handlers
	export let buttons: {
		label?: string;
		key: string;
		onClick: () => void;
		icon?: string;
		_class?: string;
	}[] = [];
</script>

<div class="pill-button hstack shadow-md min-h-[30px] rounded-r-md rounded-l-md">
	{#each buttons as { label, onClick, icon, _class }, index}
		<button
			class="h-full center {index === 0 ? 'rounded-l-md' : ''} {index === buttons.length - 1
				? 'rounded-r-md'
				: ''} gap-2 px-2 {_class}"
			on:click={onClick}
		>
			{#if icon}
				<Icon {icon} class="text-gray-300" height="20px" />
			{/if}
			{#if label}
				{label}
			{/if}
		</button>
	{/each}
</div>

<style>
	.pill-button :not(:last-child) {
		border-right: 1px solid #00000010;
	}
</style>
