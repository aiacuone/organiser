<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';

	export let onClick: () => void;
</script>

<CommonLogButton className="w-[60px]" {onClick}>
	<Icon icon={icons.tick} height="20px" class="opacity-30" />
</CommonLogButton>
