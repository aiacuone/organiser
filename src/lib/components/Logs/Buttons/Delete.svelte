<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';
</script>

<CommonLogButton className="h-[35px]">
	<Icon icon={icons.delete} height="20px" class="opacity-30" />
</CommonLogButton>
