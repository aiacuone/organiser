<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButton from './NoteButton.svelte';
	import NoteButtonContainer from './NoteButtonContainer.svelte';
	import { icons } from '$lib/general/icons';

	export let onClickReset: () => void;
	export let onAccept: () => void;
	export let time: number = 0.5;
	export let onChangeTime: (type: 'increase' | 'decrease') => void = () => {};
</script>

<div class="flex gap-8 sm:gap-2 w-full sm:w-auto center">
	<NoteButtonContainer>
		<NoteButton onClick={onClickReset}>
			<Icon icon="system-uicons:reset" height="17px" />
		</NoteButton>
		<NoteButton onClick={onAccept}>
			<Icon icon="mdi:tick" height="17px" />
		</NoteButton>
	</NoteButtonContainer>
	<div class="center flex-row sm:flex-col gap-2 sm:gap-[1px] flex-row-reverse">
		<button
			on:click={() => onChangeTime('increase')}
			class="rounded-t-md bg-white bg-opacity-30 px-2 py-[1px]"
		>
			<Icon icon={icons.up} height="17px" />
		</button>
		<p class="text-xs w-full text-center">
			{time}
		</p>
		<button
			on:click={() => onChangeTime('decrease')}
			class="rounded-b-md bg-white bg-opacity-30 px-2 py-[1px]"
		>
			<Icon icon={icons.down} height="17px" />
		</button>
	</div>
</div>
