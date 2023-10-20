<script lang="ts">
	import Icon from '@iconify/svelte';
	import Accept from './Buttons/Accept.svelte';
	import LogButton from './Buttons/AddBullet.svelte';
	import Delete from './Buttons/Delete.svelte';
	import Reset from './Buttons/Reset.svelte';
	import TimeIncrement from './Buttons/TimeIncrement.svelte';
	import { icons } from '$lib/general/icons';
</script>

<div class="bg-neutral-200 p-2 rounded-sm">
	<div class="bg-white rounded-sm p-4 stack text-sm gap-1">
		<input class="placeholder-black placeholder-opacity-30" type="text" placeholder="Title" />
		<input class="placeholder-black placeholder-opacity-30" type="text" placeholder="Reference" />
		<ul class="ml-5 stack gap-1">
			<li class="hstack center">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut feugiat lorem. Quisque
					ornare dolor sed neque consectetur, a varius augue placerat. Vivamus et lobortis turpis.
					Fusce sit amet tortor dolor. Fusce efficitur lacus tempor, semper sem et, eleifend felis.
					Vestibulum eu tincidunt tellus. Vestibulum massa nulla, lacinia id aliquet.
				</p>
				<Delete />
			</li>
			<li class="hstack center">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut feugiat lorem. Quisque
					ornare dolor sed neque consectetur, a varius augue placerat. Vivamus et lobortis turpis.
					Fusce sit amet tortor dolor. Fusce efficitur lacus tempor, semper sem et, eleifend felis.
					Vestibulum eu tincidunt tellus. Vestibulum massa nulla, lacinia id aliquet.
				</p>
				<Delete />
			</li>
		</ul>
		<div class="hstack mt-2">
			<div class="flex-1 hstack gap-4">
				<LogButton />
				<TimeIncrement />
				<Accept />
				<Reset />
			</div>
			<Icon icon={icons.clock} height="30px" class="opacity-10" />
		</div>
	</div>
</div>

<style>
	ul {
		list-style-type: disc;
	}
</style>
