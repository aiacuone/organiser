import { writable } from 'svelte/store';

export const useDisclosure = () => {
	const isOpen = writable(false);
	const onClose = () => isOpen.set(false);
	const onOpen = () => isOpen.set(true);

	return {
		isOpen,
		onOpen,
		onClose
	};
};
