<script lang="ts">
	import { goto } from '$app/navigation';
	import { getHyphenatedStringFromDate, replaceAllSpacesWithHyphens } from '$lib/utils/strings';
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/stores';
	import { axios } from '$lib';
	import { page } from '$app/stores';

	const urlSpace = $page.params.space;

	onMount(async () => {
		const spaces = await axios.get('/spaces').then((response) => response.data);
		const areThereAnySpaces = spaces.length > 0;

		if ($isAuthenticated && areThereAnySpaces) {
			const date = getHyphenatedStringFromDate(new Date());
			const space = urlSpace || spaces[0];
			goto(`/${replaceAllSpacesWithHyphens(space)}/date/${date}`);
		}
	});
</script>
