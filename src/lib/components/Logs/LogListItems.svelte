<!-- todo: combine this with LogListItems when svelte 5 is released -->
<script lang="ts">
	import type { Readable } from 'svelte/store';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';

	export let items: string[] = [];
	export let isEditing: Readable<boolean>;
	export let onEnterKeydown: () => void;
	export let onDeleteItem: (index: number) => void;
	export let bulletType: 'disc' | 'circle' | 'square' | 'checkbox' = 'disc';
</script>

<ul class="ml-5 stack" style={`list-style-type:${bulletType === 'checkbox' ? 'none' : bulletType}`}>
	{#each items as _, index}
		<li class={index % 2 === 0 ? 'bg-transparent' : 'bg-gray-100'}>
			<div class="hstack">
				<div class="flex gap-2 min-h-[20px] flex-1">
					<div class="flex-1">
						<Textarea
							_class="w-full"
							bind:value={items[index]}
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
