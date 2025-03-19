<script lang="ts">
	import { useQueryClient } from '@sveltestack/svelte-query';
	import { setContext } from 'svelte';
	import { isAuthenticated, spaces } from '$lib';

	let { children } = $props();

	const queryClient = useQueryClient();

	const invalidateLogs = async () => {
		// Need to await space first otherwise notifications will be out of sync. NOTE: This does not work anymore.
		await queryClient.invalidateQueries('spaces');
		queryClient.invalidateQueries('logs');
		queryClient.invalidateQueries('allLogNotifications');
		queryClient.invalidateQueries('filteredLogs');
	};

	setContext('invalidateLogs', invalidateLogs);

	$effect(() => {
		// This will invalidate the logs after login
		if ($isAuthenticated) {
			void invalidateLogs();
		}
	});

	$effect(() => {
		const areThereSpaces = $spaces.length;
		if (areThereSpaces) {
			// This is happening because the first attempt to fetch notifications does not have the spaces set.
			queryClient.invalidateQueries('allLogNotifications');
		}
	});
</script>

{@render children()}
