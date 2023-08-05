<script lang="ts">
	import Icon from '@iconify/svelte';
	import NoteButtonContainer from './ButtonContainer.svelte';
	import NoteContentContainer from './ContentContainer.svelte';
	import NoteButton from './Button.svelte';
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
		<NoteButton>
			<Icon icon="mdi:pencil" height="20px" />
		</NoteButton>
		<NoteButton>
			<Icon icon="akar-icons:cross" height="20px" />
		</NoteButton>
	</NoteButtonContainer>
</div>
