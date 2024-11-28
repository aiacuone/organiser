<script lang="ts">
	import Button from './Button.svelte';
	import Dialog from './Dialog/Dialog.svelte';

	interface Props extends SvelteAllProps {
		onOpen: () => void;
		onConfirm: () => void;
		isOpen: boolean;
		onClose: () => void;
	}

	const { onConfirm, isOpen, onClose, children }: Props = $props();

	const _onConfirm: (() => void) | undefined = () => {
		onClose();
		onConfirm();
	};
</script>

<Dialog {isOpen} {onClose}>
	<div class="flex flex-col sm:flex-row gap-3 items-center">
		{@render children()}
		<div class="hstack gap-3">
			<Button onClick={_onConfirm}>Yes</Button>
			<Button onClick={onClose}>No</Button>
		</div>
	</div>
</Dialog>
