<script lang="ts">
	import { useQueryClient } from '@sveltestack/svelte-query';
	import { setContext } from 'svelte';

	const queryClient = useQueryClient();

	const invalidateLogs = async () => {
		// Need to await space first otherwise notifcations will be out of sync
		await queryClient.invalidateQueries('spaces');
		queryClient.invalidateQueries('logs');
		queryClient.invalidateQueries('allLogNotifications');
		queryClient.invalidateQueries('filteredLogs');
	};

	setContext('invalidateLogs', invalidateLogs);
</script>

<slot />
