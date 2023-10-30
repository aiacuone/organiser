<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Search from '$lib/components/Search.svelte';

	let searchValue: string;

	let timer: number;
	const debounce = (fn: () => any, delay = 500) => {
		const timeout = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn();
			}, delay);
		};
		timeout();
	};

	const onChange = (e) => {
		debounce(() => goto(`/${$page.params.space}/search/${e.target.value}`));
	};
</script>

<div class="center">
	<Search bind:value={searchValue} {onChange} />
</div>
