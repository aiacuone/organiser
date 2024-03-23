<script lang="ts">
	import type { Log_int } from '$lib/types';
	import Log from './Log.svelte';

	export let logs: Log_int[];
</script>

{#each logs as log}
	<Log initialLog={log} />
{/each}
