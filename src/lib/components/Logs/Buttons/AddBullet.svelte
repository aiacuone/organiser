<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';

	export let onClick: () => void;
</script>

<CommonLogButton {onClick}>
	<Icon icon={icons.add} height="20px" class="opacity-30" />
	<Icon icon={icons.dot} height="20px" class="opacity-30" />
</CommonLogButton>
