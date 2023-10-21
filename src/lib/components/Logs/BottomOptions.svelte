<script lang="ts">
	import Accept from './Buttons/Accept.svelte';
	import Delete from './Buttons/Delete.svelte';
	import Edit from './Buttons/Edit.svelte';

	export let onDelete: () => void;
	export let onEdit: () => void;
	export let date: Date;
	export let isEditing: boolean;
	export let onAccept: () => void;
</script>

<div class="hstack items-center gap-4">
	<p class="text-xs text-opacity-30 text-black">{date}</p>
	<Edit {onEdit} />
	{#if isEditing}
		<Delete iconClass="w-[40px]" {onDelete} />
		<Accept {onAccept} />
	{/if}
</div>
