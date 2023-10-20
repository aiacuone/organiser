<script lang="ts">
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	export let onConfirm: () => void;
	export let onOpen: () => void;

	let onClose: () => void;

	export let _onConfirm: (() => void) | undefined = () => {
		onClose();
		onConfirm();
	};
</script>

<Dialog bind:onOpen bind:onClose>
	<div class="hstack gap-3 items-center">
		<slot />
		<Button onClick={_onConfirm}>Yes</Button>
		<Button onClick={onClose}>No</Button>
	</div>
</Dialog>
