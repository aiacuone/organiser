<script lang="ts">
	import Icon from '@iconify/svelte';
	import Accept from './Buttons/Accept.svelte';
	import LogButton from './Buttons/AddBullet.svelte';
	import Delete from './Buttons/Delete.svelte';
	import Reset from './Buttons/Reset.svelte';
	import TimeIncrement from './Buttons/TimeIncrement.svelte';
	import { icons } from '$lib/general/icons';
	import Edit from './Buttons/Edit.svelte';
	import Dialog from '../Dialog.svelte';

	export let isEditing = false;

	export let date: Date;
	export let content: string | string[];
	export let id: string;
	export let title: string;
	export let reference: string;
	export let time: number;

	export const onEdit = () => {
		isEditing = !isEditing;
	};

	let onOpen: () => void;
	let onClose: () => void;

	const onReset = () => {
		console.log('reset', id);
	};

	const onDelete = (index: number) => {
		console.log('delete', index, id);
	};

	const onAccept = () => {
		if (!title && !reference && !content.length) {
			return onOpen();
		}
		isEditing = !isEditing;
	};
</script>

<div class="bg-neutral-100 p-2 rounded-sm">
	<div class="bg-white rounded-sm p-4 stack text-sm gap-1">
		{#if isEditing}
			<input class="placeholder-black placeholder-opacity-30" type="text" placeholder="Title" />
		{:else}
			<p>{title}</p>
		{/if}
		{#if isEditing}
			<input class="placeholder-black placeholder-opacity-30" type="text" placeholder="Reference" />
		{:else}
			<p>{reference}</p>
		{/if}

		<ul class="ml-5 stack gap-1">
			{#each content as bulletPoint, index}
				<li>
					<div class="hstack">
						<p class="flex-1">{bulletPoint}</p>
						{#if isEditing}
							<Delete onDelete={() => onDelete(index)} />
						{/if}
					</div>
				</li>
			{/each}
		</ul>
		<div class="hstack mt-2">
			<div class="flex-1 hstack gap-4 flex-wrap">
				{#if date}
					<p class="text-xs text-opacity-30 text-black">{date}</p>
				{/if}
				<LogButton />
				<TimeIncrement {time} />
				{#if isEditing}
					<Accept {onAccept} />
				{:else}
					<Edit {onEdit} />
				{/if}
				{#if isEditing}
					<Reset {onReset} />
				{/if}
			</div>
			<Icon icon={icons.clock} height="30px" class="opacity-10" />
		</div>
	</div>
</div>

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
