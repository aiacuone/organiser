<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';
</script>

<CommonLogButton className="w-[60px]">
	<Icon icon={icons.edit} height="20px" class="opacity-30" />
</CommonLogButton>
