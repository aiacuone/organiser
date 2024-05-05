<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import CommonLogButton from './CommonLogButton.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import { useDisclosure } from '$lib/hooks';

	export let onReset: () => void;

	const onConfirm = () => {
		onReset();
	};

	const {
		onOpen: openConfirmationDialog,
		onClose: closeConfirmationDialog,
		isOpen: isConfirmationDialogOpen
	} = useDisclosure();

	let onOpen: () => void;
</script>

<CommonLogButton className="w-[60px]" onClick={onOpen}>
	<Icon icon={icons.reset} height="20px" class="text-gray-300" />
</CommonLogButton>

<ConfirmationDialog
	{onConfirm}
	onOpen={openConfirmationDialog}
	onClose={closeConfirmationDialog}
	isOpen={$isConfirmationDialogOpen}>Are you sure you want to reset?</ConfirmationDialog
>
