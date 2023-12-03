<script lang="ts">
	import { icons } from '$lib/general/icons';
	import Icon from '@iconify/svelte';
	import Button from '../Button.svelte';
	import Dialog from './Dialog.svelte';

	export let onOpen: () => void;
	export let onClose: () => void;

	let view: 'default' | 'csv' | 'text' = 'default';
</script>

<Dialog bind:onOpen bind:onClose>
	<div class="stack center gap-3 w-full">
		<div class="hstack w-full gap-5 min-h-[30px]">
			<div class="flex-1 justify-end flex">
				{#if view !== 'default'}
					<Button onClick={() => (view = 'default')}>
						<Icon icon={icons.back} />
					</Button>
				{/if}
			</div>
			<header>Export Logs</header>
			<div class="flex-1" />
		</div>
		<div class="min-h-[150px] center">
			{#if view === 'default'}
				<div class="hstack gap-2">
					<Button onClick={() => (view = 'csv')}>CSV</Button>
					<Button onClick={() => (view = 'text')}>Text</Button>
				</div>
			{:else if view === 'csv'}
				CSV
			{:else if view === 'text'}
				Text
			{/if}
		</div>
		<Button onClick={onClose}>Close</Button>
	</div>
</Dialog>
