<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Dialog from '../Dialog/Dialog.svelte';
	import LogContainer from './LogContainer.svelte';
	import BottomOptions from './BottomOptions.svelte';
	import Textarea from '../Textarea.svelte';
	import { getContext, onMount } from 'svelte';
	import { LogType_enum, type Log_int } from '$lib/types';
	import { page } from '$app/stores';
	import { getDateFromHyphenatedString } from '$lib/utils';
	import Input from '../Input.svelte';
	import { getHaveValuesChanged } from '$lib/utils/logs';
	import Icon from '@iconify/svelte';
	import { currentlyEditing, titles } from '$lib/stores';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';
	import { getHyphenatedStringFromDate } from '$lib/utils/strings';
	import { debounce } from '$lib/utils/general';
	import type { Readable } from 'svelte/motion';

	export let date: Date;
	export let bullets: string[] = [];
	export let id: string;
	export let title: string = '';
	export let reference: string = '';
	export let time: number = 0;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;

	let onOpen: () => void;
	let onClose: () => void;
	let onEdit: () => void;
	let newBulletInput: HTMLInputElement;
	let onDelete: () => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let onTitleAutoFill: (title: string) => void;

	let originalBullets = [...bullets];
	let originalTitle = title;
	let originalReference = reference;
	let originalTime = time;

	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;

	let isEditing: Readable<boolean>;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onDeleteBullet = (index: number) => {
		bullets = bullets.filter((_, i) => i !== index);
	};

	const onAcceptEdit = async () => {
		if (!title && !reference && !bullets.length) {
			return onOpen();
		}

		const haveValuesChanged = getHaveValuesChanged({
			values: {
				title,
				reference,
				bullets,
				time
			},
			originalValues: {
				title: originalTitle,
				reference: originalReference,
				bullets: originalBullets,
				time: originalTime
			}
		});

		if (!haveValuesChanged) return ($currentlyEditing = null);

		let logDate: Date = date;
		if ($page.params.date && $page.params.date !== getHyphenatedStringFromDate(date)) {
			const currentDate = new Date();
			const _date = new Date(getDateFromHyphenatedString($page.params.date));
			_date.setHours(currentDate.getHours());
			_date.setMinutes(currentDate.getMinutes());
			logDate = _date;
		}

		bullets = bullets.filter((c) => c);
		$currentlyEditing = null;
		try {
			await $updateMutation.mutate({
				id,
				title,
				reference,
				bullets,
				time,
				date: logDate,
				type: LogType_enum.time,
				space: $page.params.space,
				lastUpdated: new Date()
			});
			originalTitle = title;
			originalReference = reference;
			originalBullets = bullets;
			originalTime = time;
			lastUpdated = new Date();
		} catch (error) {
			console.log({ error });
		}

		onResetNewLogType && onResetNewLogType();
	};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();
		bullets = originalBullets;
		title = originalTitle;
		reference = originalReference;
	};

	const onAddBullet = () => {
		$currentlyEditing = id;
		bullets = [...bullets, ''];
	};

	const onAcceptNewBullet = () => {
		newBulletInput.value = '';
	};

	const onIncrement = () => {
		time = time + 0.5;
		debounce(() =>
			$updateMutation.mutate({
				id,
				title,
				reference,
				bullets,
				time,
				date,
				type: LogType_enum.time,
				space: $page.params.space
			})
		);
	};

	const onDecrement = () => {
		time = time - 0.5;
		debounce(() =>
			$updateMutation.mutate({
				id,
				title,
				reference,
				bullets,
				time,
				date,
				type: LogType_enum.time,
				space: $page.params.space
			})
		);
	};

	const incrementDecrementProps = {
		min: 0,
		max: 24,
		onIncrement,
		onDecrement
	};
	const onTextareaEnterKeydown: () => void = () => {
		onAddBullet();
	};
	const onControlShitAndEnterKeydown = () => {
		onAcceptEdit();
	};
	const onControlShitAndDotKeydown = () => {
		onAddBullet();
	};
</script>

<LogContainer
	bind:onEdit
	onConfirmReset={onResetChange}
	bind:updateLogMutation={updateMutation}
	bind:deleteLogMutation={deleteMutation}
	bind:onDelete
	{id}
	bind:onTitleAutoFill
	bind:isEditing
	{changeReferenceInputValue}
	{onControlShitAndEnterKeydown}
	{editOnMount}
	{onControlShitAndDotKeydown}
>
	<div class="bg-neutral-100 p-2 rounded-sm">
		<div class="bg-white rounded-sm p-2 stack text-sm gap-1">
			{#if title || reference || $isEditing}
				<div class="stack gap-1">
					{#if !$isEditing && !title}{''}{:else}
						<Input
							bind:value={title}
							autofocus={inputAutoFocus}
							placeholder="Title"
							autofillValues={$titles}
							isDisabled={!$isEditing}
							onAutoFill={onTitleAutoFill}
						/>
					{/if}
					{#if $isEditing || reference}
						<Input
							bind:value={reference}
							placeholder="Reference"
							isDisabled={!$isEditing}
							bind:changeInputValue={changeReferenceInputValue}
						/>
					{/if}
				</div>
			{/if}
			<ul class="ml-5 stack">
				{#each bullets as _, index}
					<li>
						<div class="flex gap-2 min-h-[20px]">
							<Textarea
								className="flex-1"
								bind:value={bullets[index]}
								isDisabled={!$isEditing}
								onEnterKeydown={onTextareaEnterKeydown}
								autofocus={index > 0}
							/>
							<div class="min-w-[40px] hidden sm:flex align-center relative">
								{#if $isEditing}
									<button class=" absolute top-0" on:click={() => onDeleteBullet(index)}>
										<Icon icon={icons.delete} class="text-gray-300" height="18px" />
									</button>
								{/if}
							</div>
						</div>
						<div class="mt-1 flex sm:hidden">
							{#if $isEditing}
								<button class="flex sm:hidden" on:click={() => onDeleteBullet(index)}>
									<Icon icon={icons.delete} class="text-gray-300" height="18px" />
								</button>
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
					isEditing={$isEditing}
					onAccept={$isEditing ? onAcceptEdit : onAcceptNewBullet}
					{onAddBullet}
					{onEdit}
					{onDelete}
					icon={icons.clock}
					{lastUpdated}
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
