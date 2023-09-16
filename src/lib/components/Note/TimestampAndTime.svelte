<script lang="ts">
	import Timestamp from './Timestamp.svelte';
	export let date: Date;
	export let time: number;
</script>

<div class="hStack gap-4 text-black text-opacity-20 text-xs">
	<Timestamp {date} />
	<p>{time} h</p>
</div>
