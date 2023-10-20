<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import BottomOptions from './BottomOptions.svelte';
</script>

<div class="bg-neutral-50 px-3 py-3 stack gap-3">
	<div class="hstack center gap-2">
		<div>
			<Icon icon={icons.important} height="40px" class="opacity-10" />
		</div>
		<p class="text-sm">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut feugiat lorem. Quisque
			ornare dolor sed neque consectetur, a varius augue placerat. Vivamus et lobortis turpis. Fusce
			sit amet tortor dolor. Fusce efficitur lacus tempor, semper sem et, eleifend felis. Vestibulum
			eu tincidunt tellus. Vestibulum massa nulla, lacinia id aliquet.
		</p>
	</div>
	<BottomOptions />
</div>
