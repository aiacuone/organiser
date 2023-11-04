<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
</script>

<div class="stack flex-1">
	<slot />
</div>
<div class="center">
	<Button onClick={() => goto(`/${$page.params.space}/`)}>
		<Icon icon={icons.home} class="text-gray-400" height="25px" />
	</Button>
</div>
