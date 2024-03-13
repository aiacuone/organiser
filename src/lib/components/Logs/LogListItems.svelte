<!-- todo: combine this with LogListItems when svelte 5 is released -->
<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { BaseMappedListItem_int, ListItem_int } from '$lib/types';

	export let items: Writable<(BaseMappedListItem_int & ListItem_int)[]>;
	export let isEditing: Readable<boolean>;
	export let onEnterKeydown: () => void;
	export let onDeleteItem: (index: number) => void;
	export let bulletType: 'disc' | 'circle' | 'square' | 'checkbox' = 'disc';
</script>

<ul
	class="ml-5 stack"
	style={`list-style-type:${
		$isEditing && $items.length > 1 ? 'none' : bulletType === 'checkbox' ? 'none' : bulletType
	}`}
	use:dndzone={{
		items: $items,
		flipDurationMs: 300,
		dropTargetStyle: {},
		dragDisabled: !$isEditing
	}}
	on:consider={(e) => ($items = e.detail.items)}
	on:finalize={(e) => ($items = e.detail.items)}
>
	{#each $items as item, index (item.id)}
		<li class="{index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50'} relative">
			{#if $isEditing && $items.length > 1}
				<Icon icon={icons.vertical} class="absolute -left-4 top-1" />
			{/if}
			<div class="hstack">
				<div class="flex gap-2 min-h-[20px] flex-1">
					<div class="flex-1">
						<Textarea
							_class="w-full"
							bind:value={$items[index].item}
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
