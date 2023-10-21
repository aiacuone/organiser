<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	export let date: Date;
	export let content: string | string[];
	export let id: string;
	export let importance: number;

	const onEdit = () => {
		console.log('edit', id);
	};

	const onDelete = () => {
		console.log('delete', id);
	};
</script>

<div class="bg-neutral-50 px-3 py-3 stack gap-3">
	<div class="hstack center gap-2">
		<IconWithRating rating={importance} icon={icons.important} />
		<p class="text-sm flex-1">
			{content}
		</p>
	</div>
	<BottomOptions {onEdit} {onDelete} {date} />
</div>
