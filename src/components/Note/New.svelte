<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './ButtonContainer.svelte';
	import NoteContentContainer from './ContentContainer.svelte';
	import NoteButton from './Button.svelte';

	export let background: string;
	export let onClickTick: () => void;
	export let onClickReset: () => void;
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-2 w-full rounded-md"
	style="background:{background}"
>
	<NoteContentContainer>
		<input
			type="text"
			placeholder="Subject"
			class="outline-0 text-opacity-30 w-4/12 h-[30px] text-black"
		/>
		<div
			class="w-full outline-0 input min-h-[30px] flex items-center break-normal"
			role="textbox"
			contenteditable
			on:input={(e) => console.log(e.target.innerText)}
		/>
	</NoteContentContainer>
	<NoteButtonContainer>
		<NoteButton onClick={onClickReset}>
			<Icon icon="system-uicons:reset" height="20px" />
		</NoteButton>
		<NoteButton onClick={onClickTick}>
			<Icon icon="mdi:tick" height="20px" />
		</NoteButton>
	</NoteButtonContainer>
</div>
