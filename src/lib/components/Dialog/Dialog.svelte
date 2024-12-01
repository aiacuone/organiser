<script lang="ts">
	interface Props extends SvelteAllProps {
		overlayClickClose?: boolean;
		dialog?: HTMLDialogElement;
		preventClose?: boolean;
		onOpen?: () => void;
		onClose: () => void;
		isOpen: boolean;
		_class?: string;
	}

	const { preventClose, isOpen, _class, children, onClose }: Props = $props();

	let dialog: HTMLDialogElement | undefined;

	$effect(() => {
		if (isOpen) {
			dialog?.showModal();
		} else {
			if (!preventClose) dialog?.close();
		}
	});

	const onkeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		}
	};
</script>

<svelte:window {onkeydown} />

<dialog bind:this={dialog} class="p-4 shadow-md rounded-sm w-full max-w-[500px] {_class}">
	<div class="w-full h-full center">
		{@render children()}
	</div>
</dialog>
