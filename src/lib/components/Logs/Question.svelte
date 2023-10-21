<script lang="ts">
	import { icons } from '$lib/general/icons';
	import BottomOptions from './BottomOptions.svelte';
	import IconWithRating from '../IconWithRating.svelte';
	import LogContainer from './LogContainer.svelte';
	export let date: Date;
	export let content: string | string[];
	export let id: string;
	export let importance: number;
	export let isEditing: boolean = false;

	const onEdit = () => {
		isEditing = true;
	};

	const onDelete = () => {
		console.log('delete', id);
		isEditing = false;
	};

	const onAccept = () => {
		console.log('accept', { id, content, importance });
		isEditing = false;
	};

	const onResetChange = () => {
		console.log('reset');
		isEditing = false;
	};
</script>

<LogContainer {isEditing} onConfirmReset={onResetChange}>
	<div class="bg-neutral-100 p-1 rounded-sm">
		<div class="bg-white px-3 py-3 stack gap-3 rounded-sm">
			<div class="hstack center gap-2">
				<IconWithRating icon={icons.question} rating={importance} />
				<p class="text-sm flex-1">
					{content}
				</p>
			</div>
			<BottomOptions {onEdit} {onDelete} {date} {onAccept} {isEditing} />
		</div>
	</div>
</LogContainer>
