<script lang="ts">
	import { useQueryClient } from '@sveltestack/svelte-query';
	import { setContext } from 'svelte';
	import { isAuthenticated } from '$lib';

	let { children } = $props();

	const queryClient = useQueryClient();

	const invalidateLogs = async () => {
		// Need to await space first otherwise notifcations will be out of sync
		await queryClient.invalidateQueries('spaces');
		queryClient.invalidateQueries('logs');
		queryClient.invalidateQueries('allLogNotifications');
		queryClient.invalidateQueries('filteredLogs');
	};

	setContext('invalidateLogs', invalidateLogs);

	$effect(() => {
		// This will invalidate the logs after login
		if ($isAuthenticated) void invalidateLogs();
	});
</script>

{@render children()}
