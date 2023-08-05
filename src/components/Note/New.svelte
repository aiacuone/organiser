<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './ButtonContainer.svelte';
	import NoteContentContainer from './ContentContainer.svelte';

	export let background: string;
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-4 w-full bg-red-500 rounded-md"
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
		<button class="bg-white bg-opacity-70 rounded-sm p-1"
			><Icon icon="system-uicons:reset" height="25px" /></button
		>
		<button class="bg-white bg-opacity-70 rounded-sm p-1"
			><Icon icon="mdi:tick" height="25px" /></button
		>
	</NoteButtonContainer>
</div>
