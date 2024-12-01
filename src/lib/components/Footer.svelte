<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import { icons } from '$lib/general/icons';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { searchValue } from '$lib/stores';
	import { createClient, loginWithRedirect, logout } from '$lib/clientServices';
	import { onMount } from 'svelte';
	import { isAuthLoading, isAuthenticated, user } from '$lib/stores/auth';
	import type { Auth0Client } from '@auth0/auth0-spa-js';
	import Dialog from './Dialog/Dialog.svelte';
	import { useDisclosure } from '$lib/hooks';

	const footerButtons = [
		{
			icon: icons.date,
			onClick: () => goto(`/${$page.params.space}`)
		},
		{
			icon: icons.search,
			onClick: () => {
				goto(`/${$page.params.space}/filter`);
				$searchValue = '';
			}
		}
	];

	let auth0Client: Auth0Client;
	onMount(async () => {
		//todo: Move this logic out of Footer. I attempted to move it into +layout.svelte, but user and isAuthenticated were undefined.
		auth0Client = await createClient();
		const _isAuthenticated = await auth0Client.isAuthenticated();
		isAuthenticated.set(_isAuthenticated);

		const _user = await auth0Client.getUser();
		_user && user.set(_user);

		const query = window.location.search;
		if (query.includes('code=') && query.includes('state=')) {
			await auth0Client.handleRedirectCallback();

			const _isAuthenticated = await auth0Client.isAuthenticated();
			const _user = await auth0Client.getUser();

			_user && user.set(_user);
			isAuthenticated.set(_isAuthenticated);

			window.history.replaceState({}, document.title, '/');
		}
		$isAuthLoading = false;
	});

	const login = () => {
		loginWithRedirect(auth0Client);
	};

	const _logout = () => {
		logout(auth0Client);
	};

	const {
		isOpen: isAvatarMenuOpen,
		onOpen: onOpenAvatarMenu,
		onClose: onCloseAvatarMenu
	} = useDisclosure();

	const onClickAvatar = () => {
		onOpenAvatarMenu();
	};
</script>

<footer class="py-2 bg-gray-300 px-3 center min-h-[50px]">
	<div class="hstack max-w-screen-lg flex-1">
		{#if $isAuthenticated}
			<div class="hstack center capitalize gap-5">
				{#each footerButtons as footerButton}
					<Button _class="bg-white bg-opacity-80" onclick={footerButton.onClick}>
						<Icon icon={footerButton.icon} />
					</Button>
				{/each}
			</div>
		{/if}
		<div class="flex justify-end flex-1">
			{#if !$isAuthLoading}
				{#if $isAuthenticated && $user.given_name && $user.family_name}
					<button
						onclick={onClickAvatar}
						class="rounded-full bg-neutral-500 h-[30px] w-[30px] center text-white"
					>
						{`${$user.given_name[0]}${$user.family_name[0]}`}
					</button>
				{:else}
					<button onclick={login} class="rounded-lg bg-neutral-500 h-[30px] px-2 center text-white"
						>Login</button
					>
				{/if}
			{/if}
		</div>
	</div>
</footer>

<Dialog isOpen={$isAvatarMenuOpen} onClose={onCloseAvatarMenu}>
	<Button onclick={_logout}>Logout</Button>
</Dialog>
