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
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';

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

	const queryClient = useQueryClient();
	const originalBullets = [...bullets];

	export const deleteMutation = useMutation(deleteLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
		}
	});

	export const updateMutation = useMutation(updateLog, {
		onSuccess: () => {
			queryClient.invalidateQueries('logs');
		}
	});

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onReset = () => {
		console.log('reset', id);
	};

	const onDelete = () => {
		isEditing = false;
		$deleteMutation.mutate(id);
	};

	const onDeleteBullet = (index: number) => {
		bullets = bullets.filter((_, i) => i !== index);
	};

	const onAcceptEdit = () => {
		if (!title && !reference && !bullets.length) {
			return onOpen();
		}

		const currentDate = new Date();
		const date = new Date(getDateFromHyphenatedString($page.params.date));
		date.setHours(currentDate.getHours());
		date.setMinutes(currentDate.getMinutes());

		bullets = bullets.filter((c) => c);
		isEditing = false;
		$updateMutation.mutate({
			id,
			title,
			reference,
			bullets,
			time,
			date,
			type: LogType_enum.time,
			space: $page.params.space
		});
		onResetNewLogType();
	};

	const onResetChange = () => {
		isEditing = false;
		onResetNewLogType();
		bullets = originalBullets;
	};

	const onAddBullet = () => {
		isEditing = true;
		bullets = [...bullets, ''];
	};

	const onAcceptNewBullet = () => {
		newBulletInput.value = '';
	};

	const onIncrement = () => {
		time = time + 0.5;
		$updateMutation.mutate({
			id,
			title,
			reference,
			bullets,
			time,
			date,
			type: LogType_enum.time,
			space: $page.params.space
		});
	};
	const onDecrement = () => {
		time = time - 0.5;
		$updateMutation.mutate({
			id,
			title,
			reference,
			bullets,
			time,
			date,
			type: LogType_enum.time,
			space: $page.params.space
		});
	};

	const incrementDecrementProps = {
		min: 0.5,
		max: 24,
		onIncrement,
		onDecrement
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
			<ul class="ml-5 stack">
				{#each bullets as _, index}
					<li>
						<div class="hstack gap-2 min-h-[40px] items-center">
							<Textarea className="flex-1" bind:value={bullets[index]} isDisabled={!isEditing} />
							<div class="min-w-[40px]">
								{#if isEditing}
									<Delete onDelete={() => onDeleteBullet(index)} />
								{/if}
							</div>
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
					icon={icons.clock}
				/>
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
