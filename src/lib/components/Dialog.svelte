<script lang="ts">
	export let dialog: HTMLDialogElement | undefined = undefined;
	export const onOpen = () => {
		dialog?.showModal();
	};
	export const onClose = () => {
		dialog?.close();
	};
</script>

<dialog bind:this={dialog} class="p-4 shadow-md rounded-sm w-full max-w-[500px]">
	<div class="w-full h-full center">
		<slot />
	</div>
</dialog>
