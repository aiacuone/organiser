<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Dialog from '../Dialog.svelte';
	import LogContainer from './LogContainer.svelte';
	import BottomOptions from './BottomOptions.svelte';
	import Textarea from '../Textarea.svelte';
	import { getContext } from 'svelte';
	import { LogType_enum, type Log_int, type TimeLog_int } from '$lib/types';
	import Input from '../Input.svelte';
	import Icon from '@iconify/svelte';
	import { currentlyEditing, space, titles } from '$lib/stores';
	import type { MutationStoreResult } from '@sveltestack/svelte-query';
	import { debounce } from '$lib/utils/general';
	import type { Readable } from 'svelte/motion';
	import { writable, type Writable } from 'svelte/store';

	export let date: Date;
	export let bullets: string[] = [];
	export let id: string;
	export let title: string = '';
	export let reference: string = '';
	export let time: number = 0;
	export let inputAutoFocus: boolean = false;
	export let lastUpdated: Date | undefined = undefined;
	export let editOnMount: boolean = false;

	const _intialValues: TimeLog_int = {
		date,
		bullets,
		id,
		title,
		reference,
		time,
		type: LogType_enum.time,
		space: $space
	};

	const values: Writable<TimeLog_int> = writable({ ..._intialValues, bullets: [...bullets] });
	const initialValues: Writable<TimeLog_int> = writable({
		..._intialValues,
		bullets: [...bullets]
	});

	let onOpen: () => void;
	let onClose: () => void;
	let onEdit: () => void;
	let newBulletInput: HTMLInputElement;
	let onDelete: () => void;
	let changeReferenceInputValue: (value: string | undefined) => void;
	let onTitleAutoFill: (title: string) => void;

	let updateMutation: MutationStoreResult<void, unknown, Log_int, unknown>;
	let deleteMutation: MutationStoreResult<void, unknown, string, unknown>;

	let isEditing: Readable<boolean>;

	const onResetNewLogType: () => void = getContext('onResetNewLogType');

	const onDeleteBullet = (index: number) => {
		$values = { ...$values, bullets: $values.bullets.filter((_, i) => i !== index) };
	};

	const onAcceptEdit = async () => {};

	const onResetChange = () => {
		$currentlyEditing = null;
		onResetNewLogType && onResetNewLogType();

		$values = $initialValues;
	};

	const onAddBullet = () => {
		$currentlyEditing = id;

		$values = { ...$values, bullets: [...$values.bullets, ''] };
	};

	const onAcceptNewBullet = () => {
		newBulletInput.value = '';
	};

	const onIncrement = () => {
		$values = { ...$values, time: $values.time + 0.5 };

		debounce(() => $updateMutation.mutate($values));
	};

	const onDecrement = () => {
		$values = { ...$values, time: $values.time - 0.5 };

		debounce(() => $updateMutation.mutate($values));
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
			{#if $values.title || $values.reference || $isEditing}
				<div class="stack gap-1">
					{#if !$isEditing && !$values.title}{''}{:else}
						<Input
							bind:value={$values.title}
							autofocus={inputAutoFocus}
							placeholder="Title"
							autofillValues={$titles}
							isDisabled={!$isEditing}
							onAutoFill={onTitleAutoFill}
						/>
					{/if}
					{#if !isEditing && !$values.reference}{''}{:else}
						<Input
							bind:value={$values.reference}
							placeholder="Reference"
							isDisabled={!$isEditing}
							bind:changeInputValue={changeReferenceInputValue}
						/>
					{/if}
				</div>
			{/if}
			<ul class="ml-5 stack">
				{#each $values.bullets as _, index}
					<li>
						<div class="flex gap-2 min-h-[20px]">
							<Textarea
								className="flex-1"
								bind:value={$values.bullets[index]}
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
					isEditing={$isEditing}
					onAccept={$isEditing ? onAcceptEdit : onAcceptNewBullet}
					{onAddBullet}
					{onEdit}
					{onDelete}
					icon={icons.clock}
					{lastUpdated}
					{values}
					{initialValues}
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
