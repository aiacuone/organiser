<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SpaceData_int } from '$lib/types';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import { onMount } from 'svelte';

	export let data: SpaceData_int;

	onMount(() => {
		goto(`/${data.space}/${getHyphenatedStringFromDate(new Date())}`);
	});
</script>
