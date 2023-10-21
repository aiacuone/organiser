<script lang="ts">
	import Icon from '@iconify/svelte';
	import Delete from './Buttons/Delete.svelte';
	import { icons } from '$lib/general/icons';
	import Dialog from '../Dialog.svelte';
	import LogContainer from './LogContainer.svelte';
	import BottomOptions from './BottomOptions.svelte';
	import Textarea from '../Textarea.svelte';

	export let isEditing = false;
	export let date: Date;
	export let content: string | string[];
	export let id: string;
	export let title: string;
	export let reference: string;
	export let time: number;
	export let isAddingBullet: boolean = false;

	let onOpen: () => void;
	let onClose: () => void;
	const onEdit = () => {
		isEditing = !isEditing;
	};
	let newBulletInput: HTMLInputElement;

	const onReset = () => {
		console.log('reset', id);
	};

	const onDelete = (index: number) => {
		console.log('delete', index, id);
		isEditing = false;
	};

	const onAcceptEdit = () => {
		if (!title && !reference && !content.length) {
			return onOpen();
		}
		isEditing = false;
	};

	const onResetChange = () => {
		console.log('reset');
		isEditing = false;
		isAddingBullet = false;
	};

	const onAddBullet = () => {
		isAddingBullet = !isAddingBullet;
	};

	const onAcceptNewBullet = () => {
		console.log({ value: newBulletInput.value });
		isAddingBullet = false;
		newBulletInput.value = '';
	};

	$: isAddingBullet, newBulletInput && isAddingBullet && newBulletInput.focus();

	const incrementDecrementProps = {
		min: 0.5,
		max: 24,
		onIncrement: () => (time = time + 0.5),
		onDecrement: () => (time = time - 0.5)
	};
</script>

<LogContainer isEditing={isEditing || isAddingBullet} onConfirmReset={onResetChange}>
	<div class="bg-neutral-100 p-2 rounded-sm">
		<div class="bg-white rounded-sm p-4 stack text-sm gap-1">
			{#if isEditing}
				<input
					value={title}
					class="placeholder-black placeholder-opacity-30"
					type="text"
					placeholder="Title"
				/>
				<input
					value={reference}
					class="placeholder-black placeholder-opacity-30"
					type="text"
					placeholder="Reference"
				/>
			{:else}
				<p>{title}</p>
				<p>{reference}</p>
			{/if}
			<ul class="ml-5 stack gap-1">
				{#each content as bulletPoint, index}
					<li>
						<div class="hstack gap-2 min-h-[30px] items-center">
							{#if isEditing}
								<Textarea value={bulletPoint} className="flex-1" />
								<Delete onDelete={() => onDelete(index)} />
							{:else}
								<p class="flex-1">{bulletPoint}</p>
							{/if}
						</div>
					</li>
				{/each}
				{#if isAddingBullet}
					<li>
						<div class="hstack">
							<input class="flex-1 p-1 resize-none" bind:this={newBulletInput} />
							{#if isEditing}
								<Delete onDelete={() => {}} />
							{/if}
						</div>
					</li>
				{/if}
			</ul>
			<div class="hstack mt-2">
				<BottomOptions
					{incrementDecrementProps}
					incrementDecrementValue={time}
					{date}
					isEditing={isEditing || isAddingBullet}
					onAccept={isEditing ? onAcceptEdit : onAcceptNewBullet}
					{onAddBullet}
					{onEdit}
					{onReset}
				/>
				<Icon icon={icons.clock} height="30px" class="opacity-10" />
			</div>
		</div>
	</div>
</LogContainer>

<Dialog bind:onOpen bind:onClose>
	<div>
		<p>You must have a title and reference to save a log.</p>
		<button on:click={onClose}>Close</button>
	</div>
</Dialog>

<style>
	ul {
		list-style-type: disc;
	}
</style>
