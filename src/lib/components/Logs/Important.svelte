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
		isEditing = false;
		console.log('accept', { id, content, importance });
	};

	const onResetChange = () => {
		console.log('reset');
		isEditing = false;
	};

	const incrementDecrementProps = {
		min: 0,
		max: 3,
		onIncrement: () => (importance = importance + 1),
		onDecrement: () => (importance = importance - 1)
	};
</script>

<LogContainer {isEditing} onConfirmReset={onResetChange}>
	<div class="bg-neutral-50 px-3 py-3 stack gap-3">
		<div class="hstack center gap-2">
			<IconWithRating rating={importance} icon={icons.important} />
			<p class="text-sm flex-1">
				{content}
			</p>
		</div>
		<BottomOptions
			{onEdit}
			{onDelete}
			{date}
			{isEditing}
			{onAccept}
			{incrementDecrementProps}
			incrementDecrementValue={importance}
			showIncrementDecrement={isEditing}
		/>
	</div>
</LogContainer>
