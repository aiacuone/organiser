<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButton from './NoteButton.svelte';
	import { icons } from '$lib/general/icons';

	export let onClickReset: () => void;
	export let onAccept: () => void;
	export let time: number = 0.5;
	export let onChangeTime: (type: 'increase' | 'decrease') => void = () => {};
	export let onClickExit: () => void;
	export let showExitButton: boolean = false;
	export let onClickDelete: () => void;
</script>

<div class="flex gap-2 w-full sm:w-auto center">
	<NoteButton onClick={onAccept}>
		<Icon icon={icons.tick} height="17px" />
	</NoteButton>
	<NoteButton onClick={onClickReset}>
		<Icon icon={icons.reset} height="17px" />
	</NoteButton>
	<div class="hStack">
		<NoteButton onClick={() => onChangeTime('decrease')}>
			<Icon icon={icons.leftArrow} height="13px" />
		</NoteButton>
		<p class="text-base text-center min-w-[25px] bg-white w-[35px]">
			{time}
		</p>
		<NoteButton onClick={() => onChangeTime('increase')}>
			<Icon icon={icons.rightArrow} height="13px" />
		</NoteButton>
	</div>

	{#if showExitButton}
		<NoteButton onClick={onClickExit}>
			<Icon icon={icons.exit} height="20px" />
		</NoteButton>
		<NoteButton onClick={onClickDelete}>
			<Icon icon={icons.delete} height="17px" />
		</NoteButton>
	{/if}
</div>
