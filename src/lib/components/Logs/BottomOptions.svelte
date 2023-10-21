<script lang="ts">
	import Delete from './Buttons/Delete.svelte';
	import Edit from './Buttons/Edit.svelte';

	export let onDelete: () => void;
	export let onEdit: () => void;
	export let date: string;
</script>

<div class="hstack items-center gap-4">
	<p class="text-xs text-opacity-30 text-black">{date}</p>
	<Edit {onEdit} />
	<Delete iconClass="w-[40px]" {onDelete} />
</div>
