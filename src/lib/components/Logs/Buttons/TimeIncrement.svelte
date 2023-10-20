<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';
</script>

<CommonLogButton className="flex px-0">
	<Icon icon={icons.left} height="20px" class="opacity-40" />
	<p class="flex-1 px-2 border-l-2 border-r-2 border-gray-200 text-gray-400">1.5</p>
	<Icon icon={icons.right} height="20px" class="opacity-40" />
</CommonLogButton>
