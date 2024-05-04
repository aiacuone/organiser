<!-- todo: combine this with LogCheckboxItems when svelte 5 is released -->
<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import type { MappedCheckboxItem } from '$lib/types';
	import {
		areAnyCheckboxItemsNotCapitalised,
		capitalizeFirstLetterOfMappedCheckboxItems
	} from '$lib/utils';

	export let checkboxes: MappedCheckboxItem[];
	export let isEditing: Readable<boolean>;
	export let onEnterKeydown: () => void;
	export let onDeleteBullet: (index: number) => void;
	export let focusElements: Writable<HTMLElement[]>;

	export let onEdit: () => void;

	const onCheckboxesChange = () => {
		onEdit();
	};

	$: {
		if (areAnyCheckboxItemsNotCapitalised(checkboxes)) {
			checkboxes = capitalizeFirstLetterOfMappedCheckboxItems(checkboxes);
		}
	}
</script>

<ul class="ml-3 stack flex-1">
	{#each checkboxes as item, index (item.id)}
		<li class="relative {index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50'}">
			{#if $isEditing && checkboxes.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-[16px] top-1" />
			{/if}
			<div class="hstack">
				<input
					type="checkbox"
					class="mr-[7px]"
					on:change={onCheckboxesChange}
					bind:checked={checkboxes[index].isChecked}
				/>
				<div class="flex gap-2 min-h-[20px] flex-1">
					<div class="flex-1">
						<Textarea
							bind:textarea={$focusElements[index + 2]}
							bind:value={checkboxes[index].text}
							className="flex-1 w-full"
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
