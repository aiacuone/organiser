<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './ButtonContainer.svelte';
	import NoteContentContainer from './ContentContainer.svelte';
	export let subject: string;
</script>

<div class="flex-col sm:flex-row center gap-2">
	<NoteContentContainer>
		<p class="text-opacity-20 text-black">{subject}</p>
		<p class="bg-white flex items-center">
			<slot />
		</p>
	</NoteContentContainer>
	<NoteButtonContainer>
		<button class="bg-white bg-opacity-70 rounded-sm p-1"
			><Icon icon="mdi:pencil" height="25px" /></button
		>
		<button class="bg-white bg-opacity-70 rounded-sm p-1"
			><Icon icon="akar-icons:cross" height="25px" /></button
		>
	</NoteButtonContainer>
</div>
