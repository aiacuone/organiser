<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import { icons } from '$lib/general/icons';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { searchValue } from '$lib/stores';
	import { createClient, loginWithPopup, logout } from '$lib/services';
	import { onMount } from 'svelte';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import type { Auth0Client } from '@auth0/auth0-spa-js';
	import { authConfig } from '$lib/config';
	import Dialog from './Dialog/Dialog.svelte';

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
		auth0Client = await createClient();

		isAuthenticated.set(await auth0Client.isAuthenticated());
		user.set(await auth0Client.getUser());
	});

	const login = () => {
		loginWithPopup(auth0Client, { domain: authConfig.domain, clientId: authConfig.clientId });
	};

	const _logout = () => {
		logout(auth0Client);
	};

	const onClickAvatar = () => {
		onOpenAvatarMenu();
	};

	let onOpenAvatarMenu: () => void;
	let onCloseAvatarMenu: () => void;
	let dialog: HTMLDialogElement;
</script>

<footer class="py-2 bg-gray-300 px-3 center">
	<div class="hstack max-w-screen-lg flex-1">
		<div class="hstack center capitalize gap-5">
			{#each footerButtons as footerButton}
				<Button _class="bg-white bg-opacity-80" onClick={footerButton.onClick}>
					<Icon icon={footerButton.icon} />
				</Button>
			{/each}
		</div>
		<div class="flex justify-end flex-1">
			{#if $isAuthenticated}
				<button
					on:click={onClickAvatar}
					class="rounded-full bg-neutral-500 h-[30px] w-[30px] center text-white"
				>
					AI
				</button>
			{:else}
				<button on:click={login} class="rounded-lg bg-neutral-500 h-[30px] px-2 center text-white"
					>Login</button
				>
			{/if}
		</div>
	</div>
</footer>

<Dialog bind:dialog bind:onClose={onCloseAvatarMenu} bind:onOpen={onOpenAvatarMenu}>
	<Button onClick={_logout}>Logout</Button>
</Dialog>
