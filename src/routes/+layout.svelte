<script lang="ts">
	import { derived, type Readable } from 'svelte/store';
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import HeaderFooterLink from '../lib/components/HeaderFooterLink.svelte';
	import type { Space_int, SpaceData_int } from '$lib/types/general';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { darkMode } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { icons } from '$lib/general/icons';

	export let data: SpaceData_int;
	const { spaces, times } = data;

	const space: Readable<Space_int | undefined> = derived(page, ($page) =>
		$page.params.space
			? data.spaces.find((space) => space.name === $page.params.space.replace('-', ' '))
			: spaces[0]
	);
	setContext('space', space);

	onMount(() => {
		const goToDefaultSpace = () => goto(`/${spaces[0].name.replace(' ', '-')}/today`);
		const isHomePage = $page.url.pathname === '/';
		if (isHomePage) goToDefaultSpace();
	});

	const queryClient = new QueryClient();

	const onClickDarkMode = () => {
		localStorage.setItem('isDarkMode', new Boolean(!$darkMode.boolean).toString());
		$darkMode.boolean = !$darkMode.boolean;
	};

	onMount(() => {
		localStorage.getItem('isDarkMode') === 'true'
			? ($darkMode.boolean = true)
			: ($darkMode.boolean = false);
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="stack h-screen">
		<header class="center py-2" style="background:{$space?.color}">
			<div class="hStack gap-2 sm:gap-4">
				{#each spaces as _space}
					{@const spaceName = _space.name.replace(' ', '-')}
					<HeaderFooterLink
						href="/{spaceName}/today"
						isSelected={$space?.name === _space.name}
						style="background:{_space.color};color:black">{_space.name}</HeaderFooterLink
					>
				{/each}
			</div>
		</header>
		<main
			class="flex-1 p-2 flex flex-col"
			style={$darkMode.boolean ? $darkMode.darkStyles.string : $darkMode.lightStyles.string}
		>
			<div class="flex justify-end">
				<button on:click={onClickDarkMode}>
					<Icon
						icon={icons.darkMode}
						height="25px"
						width="25px"
						class={$darkMode.boolean
							? `color-${$darkMode.darkStyles.color}`
							: `color-${$darkMode.lightStyles.color}`}
					/>
				</button>
			</div>
			<slot />
		</main>
		<footer class=" py-2" style="background:{$space?.color}">
			<div class="hStack center capitalize gap-2 sm:gap-4">
				{#each times as time}
					{@const timeName = time.name.replace(' ', '-')}
					<HeaderFooterLink
						href="/{$space?.name.replace(' ', '-')}/{timeName}"
						isSelected={$page.params.time === timeName}>{time.name}</HeaderFooterLink
					>
				{/each}
			</div>
		</footer>
	</div>
</QueryClientProvider>
