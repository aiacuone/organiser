<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Button {
		label: string;
		onClick: () => void;
		icon: string;
		_class: string;
		notification: number;
	}
	interface PillButtonProps extends SvelteAllProps {
		buttons: Button[];
		capitalizeLabels: boolean;
		_class: string;
	}

	// NOTE: this component is to be refactored once Svelte 5.0 releases. Use snippets to pass in buttons and their handlers
	const { buttons, capitalizeLabels, _class }: PillButtonProps = $props();

	let containerHeight: number = $state(0);
</script>

<div
	bind:clientHeight={containerHeight}
	class="pill-button hstack shadow-md min-h-[30px] rounded-r-[4px] rounded-l-[4px] text-sm center relative {_class}"
>
	{#each buttons as { label, onClick, icon, _class, notification }, index}
		<button
			class="center {index === 0 ? 'rounded-l-[4px]' : ''} {index === buttons.length - 1
				? 'rounded-r-[4px]'
				: ''} gap-2 px-2 {_class} {capitalizeLabels ? 'capitalize' : ''} relative"
			style={`height: ${containerHeight}px;`}
			onclick={onClick}
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
