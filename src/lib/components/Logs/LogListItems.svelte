<!-- todo: combine this with LogListItems when svelte 5 is released -->
<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import { LogType_enum, LogListType_enum, type MappedListItem } from '$lib/types';
	import {
		areAnyListItemsNotCapitalised,
		capitalizeFirstLetterOfMappedListItems
	} from '$lib/utils';

	interface Props {
		items: MappedListItem[];
		isEditing: Readable<boolean>;
		onEnterKeydown: () => void;
		onDeleteItem: (index: number) => void;
		logType: LogType_enum;
		listType: LogListType_enum;
		focusElements: Writable<HTMLElement[]>;
	}

	let { items, isEditing, onEnterKeydown, onDeleteItem, logType, listType, focusElements }: Props =
		$props();

	const bulletType: Record<
		LogListType_enum,
		'disc' | 'circle' | 'square' | 'checkbox' | 'decimal'
	> = {
		[LogListType_enum.ordered]: 'decimal',
		[LogListType_enum.unordered]: 'disc',
		[LogListType_enum.checkbox]: 'checkbox'
	};

	const checkeredColor: Record<LogType_enum, string> = {
		[LogType_enum.important]: 'bg-gray-50',
		[LogType_enum.question]: 'bg-gray-50',
		[LogType_enum.todo]: 'bg-gray-50',
		[LogType_enum.time]: 'bg-gray-50',
		[LogType_enum.list]: 'bg-gray-100'
	};

	$effect(() => {
		if (areAnyListItemsNotCapitalised(items)) {
			items = capitalizeFirstLetterOfMappedListItems(items);
		}
	});
</script>

<ul class="ml-8 stack w-full" style={`list-style-type:${bulletType[listType]}`}>
	{#each items as item, index (item.id)}
		<li class="{index % 2 === 0 ? 'bg-transparent' : checkeredColor[logType]} relative">
			{#if $isEditing && items.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-9 top-1" />
			{/if}
			<div class="hstack">
				<div class="flex gap-2 min-h-[20px] flex-1">
					<div class="flex-1">
						<Textarea
							_class="w-full"
							bind:value={items[index].item}
							{onEnterKeydown}
							autofocus={index > 0}
							bind:textarea={$focusElements[index + 2]}
						/>
					</div>
					<div class="min-w-[40px] hidden sm:flex align-center relative">
						{#if $isEditing}
							<button class=" absolute top-0" onclick={() => onDeleteItem(index)}>
								<Icon icon={icons.delete} class="text-gray-300" height="18px" />
							</button>
						{/if}
					</div>
				</div>
				<div class="mt-1 flex sm:hidden">
					{#if $isEditing}
						<button class="flex sm:hidden" onclick={() => onDeleteItem(index)}>
							<Icon icon={icons.delete} class="text-gray-300" height="18px" />
						</button>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ul>
