<!-- todo: combine this with LogListItems when svelte 5 is released -->
<script lang="ts">
	import type { Readable } from 'svelte/store';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import {
		LogType_enum,
		type BaseMappedListItem_int,
		type ListItem_int,
		LogListType_enum
	} from '$lib/types';
	import { onMount } from 'svelte';

	export let items: (BaseMappedListItem_int & ListItem_int)[];
	export let isEditing: Readable<boolean>;
	export let onEnterKeydown: () => void;
	export let onDeleteItem: (index: number) => void;
	export let logType: LogType_enum;
	export let listType: LogListType_enum;

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
</script>

<ul
	class="ml-8 stack w-full"
	style={`list-style-type:${
		items.length === 1 && listType !== LogListType_enum.checkbox ? 'none' : bulletType[listType]
	}`}
	use:dndzone={{
		items,
		flipDurationMs: 300,
		dropTargetStyle: {},
		dragDisabled: !$isEditing
	}}
	on:consider={(e) => (items = e.detail.items)}
	on:finalize={(e) => (items = e.detail.items)}
>
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
							isDisabled={!$isEditing}
							{onEnterKeydown}
							autofocus={index > 0}
						/>
					</div>
					<div class="min-w-[40px] hidden sm:flex align-center relative">
						{#if $isEditing}
							<button class=" absolute top-0" on:click={() => onDeleteItem(index)}>
								<Icon icon={icons.delete} class="text-gray-300" height="18px" />
							</button>
						{/if}
					</div>
				</div>
				<div class="mt-1 flex sm:hidden">
					{#if $isEditing}
						<button class="flex sm:hidden" on:click={() => onDeleteItem(index)}>
							<Icon icon={icons.delete} class="text-gray-300" height="18px" />
						</button>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ul>
