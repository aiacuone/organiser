<script lang="ts" context="module">
	export interface PillButton_int {
		label?: string;
		onClick: () => void;
		icon?: string;
		_class?: string;
		notification?: number;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	export let capitalizeLabels: boolean = true;

	// NOTE: this component is to be refactored once Svelte 5.0 releases. Use snippets to pass in buttons and their handlers
	export let buttons: {
		label?: string;
		onClick: () => void;
		icon?: string;
		_class?: string;
		notification?: number;
	}[] = [];

	let containerHeight: number = 0;
</script>

<div
	bind:clientHeight={containerHeight}
	class="pill-button hstack shadow-md min-h-[30px] rounded-r-md rounded-l-md text-sm center"
>
	{#each buttons as { label, onClick, icon, _class, notification }, index}
		<button
			class="center {index === 0 ? 'rounded-l-md' : ''} {index === buttons.length - 1
				? 'rounded-r-md'
				: ''} gap-2 px-2 {_class} {capitalizeLabels ? 'capitalize' : ''} relative"
			style={`height: ${containerHeight}px;`}
			on:click={onClick}
		>
			{#if icon}
				<Icon {icon} class="text-gray-300" height="20px" />
			{/if}
			{#if label}
				{label}
			{/if}
			{#if notification}
				<p
					class="absolute -top-[5px] -right-[1px] text-[9px] rounded-full bg-blue-400 w-[16px] h-[16px] center text-white"
				>
					{notification}
				</p>
			{/if}
		</button>
	{/each}
</div>

<style>
	.pill-button :not(:last-child) {
		border-right: 1px solid #00000010;
	}
</style>
