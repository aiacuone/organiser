<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	export let data;

	const space = derived(page, ($page) =>
		data.spaces.find((space) => space.name === $page.params.space.replace('-', ' '))
	);
</script>

<div class="h-full center">
	<div class="w-11/12 center rounded-md p-4 max-w-screen-lg" style="background:{$space.color}">
		<slot />
	</div>
</div>
