<!-- todo: combine this with LogCheckboxItems when svelte 5 is released -->
<script lang="ts">
	import type { Readable } from 'svelte/store';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import type { Todo_int } from '$lib/types';

	export let checkboxes: Todo_int[] = [];
	export let isEditing: Readable<boolean>;
	export let onEnterKeydown: () => void;
	export let onDeleteBullet: (index: number) => void;

	export let onEdit: () => void;

	const onCheckboxesChange = () => {
		onEdit();
	};
</script>

<ul class="ml-5 stack">
	{#each checkboxes as _, index}
		<li>
			<div class="hstack">
				<input
					type="checkbox"
					class="mr-2"
					on:change={onCheckboxesChange}
					bind:checked={checkboxes[index].isCompleted}
				/>
				<div class="flex gap-2 min-h-[20px] flex-1">
					<div class="flex-1">
						<Textarea
							className="flex-1"
							bind:value={checkboxes[index].content}
							isDisabled={!$isEditing}
							{onEnterKeydown}
							autofocus={index > 0}
						/>
					</div>
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
			</div>
		</li>
	{/each}
</ul>