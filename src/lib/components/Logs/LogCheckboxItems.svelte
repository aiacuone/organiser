<!-- todo: Refactor this into LogListItems along with LogQuestionItems -->
<script lang="ts">
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import type { MappedCheckboxItem } from '$lib/types';
	import {
		areAnyCheckboxItemsNotCapitalised,
		capitalizeFirstLetterOfMappedCheckboxItems
	} from '$lib/utils';

	interface Props {
		checkboxes: MappedCheckboxItem[];
		isEditing: boolean;
		onEnterKeydown: () => void;
		onDeleteBullet: (index: number) => void;
		focusElements: HTMLElement[];
		onEdit: () => void;
		onClickInput: (e: MouseEvent) => void;
	}

	let {
		checkboxes = $bindable([]),
		isEditing,
		onEnterKeydown,
		onDeleteBullet,
		focusElements = $bindable([]),
		onEdit,
		onClickInput: _onClickInput
	}: Props = $props();

	const onCheckboxesChange = () => onEdit();

	$effect(() => {
		if (areAnyCheckboxItemsNotCapitalised(checkboxes)) {
			checkboxes = capitalizeFirstLetterOfMappedCheckboxItems(checkboxes);
		}
	});

	const onClickInput = (e: MouseEvent) => {
		_onClickInput(e);
	};
</script>

<ul class="ml-3 stack flex-1">
	{#each checkboxes as item, index (item.id)}
		<li class="relative {index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50'}">
			{#if isEditing && checkboxes.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-[16px] top-1" />
			{/if}
			<div class="hstack">
				<input
					bind:checked={checkboxes[index].isChecked}
					type="checkbox"
					class="mr-[7px]"
					onchange={onCheckboxesChange}
					onclick={onClickInput}
				/>
				<div class="flex gap-2 min-h-[20px] flex-1">
					<div class="flex-1">
						<Textarea
							bind:textarea={focusElements[focusElements.length]}
							bind:value={checkboxes[index].text}
							onchange={(e:Event) => (checkboxes[index].text = (e.target as HTMLInputElement).value)}
							_class="flex-1 w-full"
							{onEnterKeydown}
							autofocus={index > 0}
							onclick={onClickInput}
							isDisabled={!isEditing}
						/>
					</div>
					<div class="min-w-[40px] hidden sm:flex align-center relative">
						{#if isEditing}
							<button class=" absolute top-0" onclick={() => onDeleteBullet(index)}>
								<Icon icon={icons.delete} class="text-gray-300" height="18px" />
							</button>
						{/if}
					</div>
				</div>
				<div class="mt-1 flex sm:hidden">
					{#if isEditing}
						<button class="flex sm:hidden" onclick={() => onDeleteBullet(index)}>
							<Icon icon={icons.delete} class="text-gray-300" height="18px" />
						</button>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ul>
