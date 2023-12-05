<script lang="ts">
	import { clickOutside } from '$lib/utils/clickAway';

	export let overlayClickClose: boolean = true;
	export let dialog: HTMLDialogElement | undefined = undefined;
	export let preventClose: boolean = false;
	export let isOpen: boolean = false;
	export const onOpen = () => {
		isOpen = true;
		dialog?.showModal();
	};
	export let onClose = () => {
		isOpen = false;
		if (preventClose) return;
		if (dialog && dialog.open && overlayClickClose) {
			dialog?.close();
		}
	};
	const onClickOutside = () => {
		onClose();
	};
	export let _class: string = '';
</script>

<dialog bind:this={dialog} class="p-4 shadow-md rounded-sm w-full max-w-[500px] {_class}">
	<div class="w-full h-full center" use:clickOutside on:click_outside={onClickOutside}>
		<slot />
	</div>
</dialog>
