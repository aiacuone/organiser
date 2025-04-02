<script lang="ts">
	import Icon from '@iconify/svelte'
	import Button from './Button.svelte'
	import { icons } from '$lib/general/icons'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { searchValue } from '$lib/stores'
	import { isAuthLoading, isAuthenticated, user } from '$lib/stores/auth'
	import Dialog from './Dialog/Dialog.svelte'
	import { useDisclosure } from '$lib/hooks'
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { SignIn } from '@auth/sveltekit/components'

	const footerButtons = [
		{
			icon: icons.date,
			onClick: () => goto(`/${$page.params.space}`)
		},
		{
			icon: icons.search,
			onClick: () => {
				goto(`/${$page.params.space}/filter`)
				$searchValue = ''
			}
		}
	]

	const {
		isOpen: isAvatarMenuOpen,
		onOpen: onOpenAvatarMenu,
		onClose: onCloseAvatarMenu
	} = useDisclosure()

	const onClickAvatar = () => {
		onOpenAvatarMenu()
	}

	const login = () => {
		signIn()
	}
	const logout = () => {
		signOut()
	}
</script>

<footer class="py-2 bg-gray-300 px-3 center min-h-[50px]">
	<div class="hstack max-w-(--breakpoint-lg) flex-1">
		{#if $isAuthenticated}
			<div class="hstack center capitalize gap-5">
				{#each footerButtons as footerButton}
					<Button _class="bg-white/80" onclick={footerButton.onClick}>
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
					<SignIn>
						<button class="rounded-lg bg-neutral-500 h-[30px] px-2 center text-white">Login</button>
					</SignIn>
				{/if}
			{/if}
		</div>
	</div>
</footer>

<Dialog isOpen={$isAvatarMenuOpen} onClose={onCloseAvatarMenu}>
	<Button onclick={logout}>Logout</Button>
</Dialog>
