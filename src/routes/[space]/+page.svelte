<script lang="ts">
	import { goto } from '$app/navigation';
	import { selectedHyphenatedDateString } from '$lib/stores/dates';

	import type { SpaceData_int } from '$lib/types';
	import { replaceAllSpacesWithHyphens } from '$lib/utils/strings';
	import { onMount } from 'svelte';

	export let data: SpaceData_int;

	onMount(() => {
		const space = data.space ?? data.spaces[0];
		goto(`/${replaceAllSpacesWithHyphens(space)}/${selectedHyphenatedDateString}`);
	});
</script>
