<script lang="ts">
	import { goto } from '$app/navigation'
	import Icon from '@iconify/svelte'
	import Button from './Button.svelte'
	import Dialog from './Dialog/Dialog.svelte'
	import { useQuery, type QueryKey, type UseQueryStoreResult } from '@sveltestack/svelte-query'
	import PillButton from './Logs/Buttons/PillButton.svelte'
	import { derived } from 'svelte/store'
	import { page } from '$app/stores'
	import {
		LogType_enum,
		axios,
		icons,
		isAuthenticated,
		logIcons,
		getHyphenatedStringFromDate,
		replaceAllHyphensWithSpaces,
		replaceAllSpacesWithHyphens,
		useDisclosure,
		type LogNotification_int,
		spaces
	} from '$lib'
	import AddSpace from './AddSpace.svelte'

	interface Props extends SvelteAllProps {
		space: string | undefined
	}

	const { space }: Props = $props()
	let isAddingNewSpace: boolean = $state(false)

	const {
		isOpen: isSpaceDialogOpen,
		onOpen: openSpaceDialog,
		onClose: closeSpaceDialog
	} = useDisclosure()

	const spacesQuery = useQuery(
		`spaces`,
		async () => {
			if (!$isAuthenticated) return
			return await axios
				.get(`/spaces`)
				.then(({ data }) => data)
				.catch((err) => console.log(err))
		},
		{
			refetchOnMount: false,
			onSuccess: (data) => {
				$spaces = data
			}
		}
	)

	// I attempted to move both spacesQuery and allLogsNotificationsQuery to the layout component, but the token is not set when the layout component attempts to fetch the data.

	const allLogsNotificationsQuery: UseQueryStoreResult<QueryKey, any, LogNotification_int[], any> =
		useQuery(
			`allLogNotifications`,
			async () => {
				if (!$isAuthenticated) return

				const params = { spaces: $spacesQuery.data }

				return await axios
					.get(`/log/notifications`, { params })
					.then(({ data }) => data)
					.catch((err) => console.log(err))
			},
			{
				refetchOnMount: false
			}
		)

	const gotoLogType = (type: LogType_enum, hasNotification: boolean = false) => {
		let url = `/${$page.params.space}/filter?type=${type}`
		if (hasNotification) {
			if (type === LogType_enum.todo) url = `${url}&isChecked=false`
			if (type === LogType_enum.question) url = `${url}&isAnswered=false`
		}
		goto(url)
	}

	const headerButtons: Record<
		LogType_enum,
		{
			icon: string
			onclick: (hasNotification?: boolean) => void
		}
	> = {
		[LogType_enum.time]: {
			icon: logIcons.time,
			onclick: () => gotoLogType(LogType_enum.time)
		},
		[LogType_enum.todo]: {
			icon: logIcons.todo,
			onclick: (hasNotification?: boolean) => gotoLogType(LogType_enum.todo, hasNotification)
		},
		[LogType_enum.important]: {
			icon: logIcons.important,
			onclick: () => gotoLogType(LogType_enum.important)
		},
		[LogType_enum.question]: {
			icon: logIcons.question,
			onclick: (hasNotification?: boolean) => gotoLogType(LogType_enum.question, hasNotification)
		},
		[LogType_enum.list]: {
			icon: logIcons.list,
			onclick: () => gotoLogType(LogType_enum.list)
		}
	}
	const onAddSpace = () => {
		closeSpaceDialog()
	}

	const pillButtons = derived(
		[allLogsNotificationsQuery, page],
		([$allLogsNotificationsQuery, $page]) => {
			if (!$allLogsNotificationsQuery?.data) return []

			const doesSpaceExistInDb = $allLogsNotificationsQuery.data.some(
				({ space }) => space === $page.params.space
			)

			const pillButtonsWithNewSpace = doesSpaceExistInDb
				? $allLogsNotificationsQuery.data
				: [...$allLogsNotificationsQuery.data, { space: $page.params.space, todo: 0, question: 0 }]

			return pillButtonsWithNewSpace.map(({ space, todo, question }) => {
				const result: {
					label?: string
					onclick: () => void
					notification: number
					icon?: string
				}[] = [
					{
						label: replaceAllHyphensWithSpaces(space),
						onclick: () => {
							goto(
								`/${replaceAllSpacesWithHyphens(space)}/date/${getHyphenatedStringFromDate(
									new Date()
								)}`
							)
							closeSpaceDialog()
						},
						notification: 0
					}
				]

				if (todo)
					result.push({
						notification: todo,
						onclick: () => {
							closeSpaceDialog()
							goto(`/${space}/filter?type=todo&isChecked=false`)
						},
						icon: icons.todo
					})

				if (question)
					result.push({
						notification: question,
						onclick: () => {
							closeSpaceDialog()
							goto(`/${space}/filter?type=question&isAnswered=false`)
						},
						icon: icons.question
					})

				result.push({
					icon: icons.moreVertical,
					onclick: () => {
						goto(`/${space}/overview`)
						closeSpaceDialog()
					},
					notification: 0
				})

				return result
			})
		}
	)

	const _openSpaceDialog = () => {
		openSpaceDialog()
		isAddingNewSpace = false
	}
</script>

<header class="center py-2 px-3 bg-gray-200">
	<div class="flex-1 max-w-(--breakpoint-lg) hstack">
		<div class="flex-1">
			<img src="/logit-logo-symbol-light.svg" alt="Logit Logo" class="h-[30px]" />
		</div>
		{#if $isAuthenticated && space}
			<div class="flex-1 center">
				<button onclick={_openSpaceDialog} class="capitalize">
					{space}
				</button>
			</div>
			<div class="flex-1 hstack justify-end gap-5">
				{#if $allLogsNotificationsQuery.data}
					{#each Object.entries(headerButtons) as [type, { icon, onclick }]}
						{@const spaceNotifications = $allLogsNotificationsQuery.data?.find(
							({ space: _space }) => _space === space
						)}
						{@const notificationsCount = spaceNotifications?.[type as keyof LogNotification_int]}

						<button onclick={() => onclick(!!notificationsCount)} class="relative">
							<Icon {icon} class="text-gray-500" height="20px" />
							{#if notificationsCount}
								<div
									class="absolute top-0 -right-2 rounded-full bg-blue-400 text-[10px] w-[15px] h-[15px] text-white"
								>
									{notificationsCount}
								</div>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</header>

<Dialog isOpen={$isSpaceDialogOpen} onClose={closeSpaceDialog}>
	<div class="stack gap-3">
		<img src="/logit-logo-light.svg" alt="Logit Logo" class="h-[60px]" />
		<div class="stack gap-4 self-center">
			{#each $pillButtons as pillButton}
				<div class="hstack gap-2 items-center relative">
					<PillButton buttons={pillButton} />
				</div>
			{/each}
		</div>
		<div class="min-h-[50px] center">
			{#if isAddingNewSpace}
				<AddSpace {onAddSpace} />
			{:else}
				<Button onclick={() => (isAddingNewSpace = true)}>Add</Button>
			{/if}
		</div>
	</div>
</Dialog>
