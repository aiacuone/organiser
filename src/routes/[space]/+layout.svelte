<script lang="ts">
	import { useQueryClient } from '@sveltestack/svelte-query';
	import { setContext } from 'svelte';

	const queryClient = useQueryClient();

	const invalidateLogs = () => {
		queryClient.invalidateQueries('logs');
		queryClient.invalidateQueries('allLogNotifications');
		queryClient.invalidateQueries('filteredLogs');
		queryClient.invalidateQueries('spaces');
	};

	setContext('invalidateLogs', invalidateLogs);
</script>

<slot />
