<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SpaceData_int } from '$lib/types';
	import { getHyphenatedStringFromDate, replaceAllSpacesWithHyphens } from '$lib/utils/strings';
	import { onMount } from 'svelte';

	export let data: SpaceData_int;

	onMount(() => {
		const space = data.space || data.spaces[0];
		const date = getHyphenatedStringFromDate(new Date());
		goto(`/${replaceAllSpacesWithHyphens(space)}/${date}`);
	});
</script>
