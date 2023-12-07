<script lang="ts">
	import type { Readable } from 'svelte/store';
	import Textarea from '../Textarea.svelte';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';
	import type { Todo_int } from '$lib/types';

	export let bullets: string[] = [];
	export let todos: Todo_int[] = [];
	export let isEditing: Readable<boolean>;
	export let onEnterKeydown: () => void;
	export let onDeleteBullet: (index: number) => void;
	export let bulletType: 'disc' | 'circle' | 'square' | 'checkbox' = 'disc';
</script>

<ul class="ml-5 stack" style={`list-style-type:${bulletType === 'checkbox' ? 'none' : bulletType}`}>
	{#each todos ?? bullets as _, index}
		<li>
			<div class="hstack">
				{#if bullets}
					<input type="checkbox" class="mr-2" />
				{/if}
				<div class="flex gap-2 min-h-[20px] flex-1">
					<div class="{bullets.length ? 'block' : 'hidden'} flex-1">
						<Textarea
							className="flex-1"
							bind:value={bullets[index]}
							isDisabled={!$isEditing}
							{onEnterKeydown}
							autofocus={index > 0}
						/>
					</div>
					<div class="{todos.length ? 'block' : 'hidden'} flex-1">
						<Textarea
							className="flex-1"
							bind:value={todos[index].content}
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
