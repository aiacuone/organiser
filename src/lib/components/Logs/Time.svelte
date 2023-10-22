<script lang="ts">
	import Icon from '@iconify/svelte';
	import Delete from './Buttons/Delete.svelte';
	import { icons } from '$lib/general/icons';
	import Dialog from '../Dialog.svelte';
	import LogContainer from './LogContainer.svelte';
	import BottomOptions from './BottomOptions.svelte';
	import Textarea from '../Textarea.svelte';
	import { getContext } from 'svelte';
	import { deleteLog, updateLog } from '$lib/api/logsLocalApi';

	import { LogType_enum } from '$lib/types';
	import { page } from '$app/stores';
	import { getDateFromHyphenatedString } from '$lib/utils';

	export let isEditing = false;
	export let date: Date;
	export let bullets: string[];
	export let id: string;
	export let title: string;
	export let reference: string;
	export let time: number;
	export let inputAutoFocus: boolean = false;

	let onOpen: () => void;
	let onClose: () => void;
	const onEdit = () => {
		isEditing = !isEditing;
	};
	let newBulletInput: HTMLInputElement;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onReset = () => {
		console.log('reset', id);
	};

	const onDelete = () => {
		isEditing = false;
		deleteLog(id);
	};

	const onDeleteBullet = (index: number) => {
		bullets = bullets.filter((_, i) => i !== index);
	};

	const onAcceptEdit = () => {
		if (!title && !reference && !bullets.length) {
			return onOpen();
		}

		bullets = bullets.filter((c) => c);
		isEditing = false;
		updateLog({
			id,
			title,
			reference,
			bullets,
			time,
			date: getDateFromHyphenatedString($page.params.date),
			type: LogType_enum.time,
			space: $page.params.space
		});
	};

	const onResetChange = () => {
		console.log('reset');
		isEditing = false;
		onResetNewLogType();
	};

	const onAddBullet = () => {
		bullets = [...bullets, ''];
	};

	const onAcceptNewBullet = () => {
		console.log({ value: newBulletInput.value });
		newBulletInput.value = '';
	};

	const incrementDecrementProps = {
		min: 0.5,
		max: 24,
		onIncrement: () => (time = time + 0.5),
		onDecrement: () => (time = time - 0.5)
	};
</script>

<LogContainer {isEditing} onConfirmReset={onResetChange}>
	<div class="bg-neutral-100 p-2 rounded-sm">
		<div class="bg-white rounded-sm p-4 stack text-sm gap-1">
			{#if isEditing}
				<input
					bind:value={title}
					class="placeholder-black placeholder-opacity-30"
					type="text"
					placeholder="Title"
					autofocus={inputAutoFocus}
				/>
				<input
					bind:value={reference}
					class="placeholder-black placeholder-opacity-30"
					type="text"
					placeholder="Reference"
				/>
			{:else}
				<p>{title}</p>
				<p>{reference}</p>
			{/if}
			<ul class="ml-5 stack gap-1">
				{#each bullets as _, index}
					<li>
						<div class="hstack gap-2 min-h-[30px] items-center">
							{#if isEditing}
								<Textarea className="flex-1" bind:value={bullets[index]} />
								<Delete onDelete={() => onDeleteBullet(index)} />
							{:else}
								<p class="flex-1">{bullets[index]}</p>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
			<div class="hstack mt-2">
				<BottomOptions
					{incrementDecrementProps}
					incrementDecrementValue={time}
					{date}
					{isEditing}
					onAccept={isEditing ? onAcceptEdit : onAcceptNewBullet}
					{onAddBullet}
					{onEdit}
					{onReset}
					{onDelete}
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
