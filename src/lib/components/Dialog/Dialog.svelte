<script lang="ts">
	import { clickOutside } from '$lib/utils/clickAway';

	export let overlayClickClose: boolean = true;
	export let dialog: HTMLDialogElement | undefined = undefined;

	export const onOpen = () => {
		dialog?.showModal();
	};

	export let onClose = () => {
		if (dialog && dialog.open && overlayClickClose) {
			dialog?.close();
		}
	};
	const onClickOutside = () => {
		onClose();
	};
</script>

<dialog bind:this={dialog} class="p-4 shadow-md rounded-sm w-full max-w-[500px]">
	<div class="w-full h-full center" use:clickOutside on:click_outside={onClickOutside}>
		<slot />
	</div>
</dialog>
