<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import BottomOptions from './BottomOptions.svelte';

	const onEdit = () => {
		console.log('edit');
	};

	const onDelete = () => {
		console.log('delete');
	};

	const date = 'Friday, 12/5/23, 10:23AM';
</script>

<div class="bg-neutral-100 p-1 rounded-sm">
	<div class="bg-white px-3 py-3 stack gap-3 rounded-sm">
		<div class="hstack center gap-2">
			<div>
				<Icon icon={icons.question} height="40px" class="opacity-10" />
			</div>
			<p class="text-sm">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut feugiat lorem. Quisque
				ornare dolor sed neque consectetur, a varius augue placerat. Vivamus et lobortis turpis.
				Fusce sit amet tortor dolor. Fusce efficitur lacus tempor, semper sem et, eleifend felis.
				Vestibulum eu tincidunt tellus. Vestibulum massa nulla, lacinia id aliquet.
			</p>
		</div>
		<BottomOptions {onEdit} {onDelete} {date} />
	</div>
</div>
