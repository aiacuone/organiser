<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButton from './NoteButton.svelte';
	import { icons } from '$lib/general/icons';

	export let onClickReset: () => void;
	export let onAccept: () => void;
	export let time: number = 0.5;
	export let onChangeTime: (type: 'increase' | 'decrease') => void = () => {};
</script>

<div class="flex gap-2 w-full sm:w-auto center">
	<NoteButton onClick={onAccept}>
		<Icon icon={icons.tick} height="17px" />
	</NoteButton>
	<NoteButton onClick={onClickReset}>
		<Icon icon={icons.reset} height="17px" />
	</NoteButton>
	<NoteButton onClick={() => onChangeTime('increase')}>
		<Icon icon={icons.up} height="17px" />
	</NoteButton>
	<p class="text-base text-center min-w-[25px] bg-white w-[35px]">
		{time}
	</p>
	<NoteButton onClick={() => onChangeTime('decrease')}>
		<Icon icon={icons.down} height="17px" />
	</NoteButton>
</div>
