<script lang="ts">
	import type { SpaceData_int, Space_int } from '../../../types/general';
	import Icon from '@iconify/svelte';
	import NewNote from '../../../components/Note/New.svelte';
	import NoteListItem from '../../../components/Note/ListItem.svelte';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	interface PageData extends SpaceData_int {
		time: string;
	}

	export let data: PageData;

	const space: Readable<Space_int> = getContext('space');
</script>

<div class="h-full center stack">
	<div class="stack gap-2">
		<div class="center text-xl hStack gap-2">
			<p class="capitalize text-opacity-40 text-black">{$space.name}</p>
			<p class="text-opacity-40 text-black">-</p>
			<p class="capitalize">{data.time}</p>
		</div>
		<NewNote background={$space.color} />
		<div class="w-full center rounded-md p-2 max-w-screen-lg" style="background:{$space?.color}">
			<div class="w-full stack gap-2 text-xs sm:text-sm md:text-md">
				<NoteListItem subject="first subject">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae enim ut mi
					lobortis commodo vitae ut justo. Etiam rutrum ligula justo, sit amet elementum sapien
					ultrices eu. Praesent sit amet nisl volutpat quam fermentum suscipit. Aenean sodales ante
					sed enim porta, sit amet viverra nulla porta. Curabitur sodales pharetra.
				</NoteListItem>
				<NoteListItem subject="second subject">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae enim ut mi
					lobortis commodo vitae ut justo. Etiam rutrum ligula justo, sit amet elementum sapien
					ultrices eu. Praesent sit amet nisl volutpat quam fermentum suscipit. Aenean sodales ante
					sed enim porta, sit amet viverra nulla porta. Curabitur sodales pharetra.
				</NoteListItem>
			</div>
		</div>
	</div>
</div>
