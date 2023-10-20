<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';
</script>

<CommonLogButton>
	<Icon icon={icons.add} height="20px" class="opacity-30" />
	<Icon icon={icons.dot} height="20px" class="opacity-30" />
</CommonLogButton>
