<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog/Dialog.svelte';
	import { useQuery, type QueryKey, type UseQueryStoreResult } from '@sveltestack/svelte-query';
	import PillButton from './Logs/Buttons/PillButton.svelte';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import LogitLogoSimple from '$lib/svg/logit-logo-simple.svelte';
	import {
		LogType_enum,
		axios,
		icons,
		isAuthenticated,
		logIcons,
		getHyphenatedStringFromDate,
		replaceAllHyphensWithSpaces,
		replaceAllSpacesWithHyphens,
		useDisclosure
	} from '$lib';
	import LogitLogo from '$lib/svg/logit-logo.svelte';
	import AddSpace from './AddSpace.svelte';

	interface HeaderProps extends SvelteAllProps {
		space: string | undefined;
	}

	const { space }: HeaderProps = $props();
	let isAddingNewSpace: boolean = $state(false);

	const {
		isOpen: isSpaceDialogOpen,
		onOpen: openSpaceDialog,
		onClose: closeSpaceDialog
	} = useDisclosure();

	const spacesQuery = useQuery(
		`spaces`,
		async () => {
			if (!$isAuthenticated) return;
			return await axios
				.get(`/spaces`)
				.then(({ data }) => data)
				.catch((err) => console.log(err));
		},
		{
			refetchOnMount: false
		}
	);

	const allLogsNotificationsQuery: UseQueryStoreResult<
		QueryKey,
		any,
		{
			space: string;
			todo: number;
			question: number;
		}[],
		any
	> = useQuery(
		`allLogNotifications`,
		async () => {
			if (!$isAuthenticated) return;
			return await axios
				.get(`/log/notifications`, { params: { spaces: $spacesQuery.data } })
				.then(({ data }) => data)
				.catch((err) => console.log(err));
		},
		{
			refetchOnMount: false
		}
	);

	const gotoLogType = (type: LogType_enum, hasNotification: boolean = false) => {
		let url = `/${$page.params.space}/filter?type=${type}`;
		if (hasNotification) {
			if (type === LogType_enum.todo) url = `${url}&isChecked=false`;
			if (type === LogType_enum.question) url = `${url}&isAnswered=false`;
		}
		goto(url);
	};

	const headerButtons: Record<
		LogType_enum,
		{
			icon: string;
			onClick: (hasNotification?: boolean) => void;
		}
	> = {
		[LogType_enum.time]: {
			icon: logIcons.time,
			onClick: () => gotoLogType(LogType_enum.time)
		},
		[LogType_enum.todo]: {
			icon: logIcons.todo,
			onClick: (hasNotification?: boolean) => gotoLogType(LogType_enum.todo, hasNotification)
		},
		[LogType_enum.important]: {
			icon: logIcons.important,
			onClick: () => gotoLogType(LogType_enum.important)
		},
		[LogType_enum.question]: {
			icon: logIcons.question,
			onClick: (hasNotification?: boolean) => gotoLogType(LogType_enum.question, hasNotification)
		},
		[LogType_enum.list]: {
			icon: logIcons.list,
			onClick: () => gotoLogType(LogType_enum.list)
		}
	};
	const onAddSpace = () => {
		closeSpaceDialog();
	};

	const pillButtons = derived(
		[allLogsNotificationsQuery, page],
		([$allLogsNotificationsQuery, $page]) => {
			if (!$allLogsNotificationsQuery?.data) return [];

			const doesSpaceExistInDb = $allLogsNotificationsQuery.data.some(
				({ space }) => space === $page.params.space
			);

			const pillButtonsWithNewSpace = doesSpaceExistInDb
				? $allLogsNotificationsQuery.data
				: [...$allLogsNotificationsQuery.data, { space: $page.params.space, todo: 0, question: 0 }];

			return pillButtonsWithNewSpace.map(({ space, todo, question }) => {
				const result = [
					{
						label: replaceAllHyphensWithSpaces(space),
						onClick: () => {
							goto(
								`/${replaceAllSpacesWithHyphens(space)}/date/${getHyphenatedStringFromDate(
									new Date()
								)}`
							);
							closeSpaceDialog();
						},
						notification: 0
					}
				];

				if (todo)
					result.push({
						notification: todo,
						onClick: () => {
							closeSpaceDialog();
							goto(`/${space}/filter?type=todo&isChecked=false`);
						},
						icon: icons.todo
					});

				if (question)
					result.push({
						notification: question,
						onClick: () => {
							closeSpaceDialog();
							goto(`/${space}/filter?type=question&isAnswered=false`);
						},
						icon: icons.question
					});

				result.push({
					icon: icons.moreVertical,
					onClick: () => {
						goto(`/${space}/overview`);
						closeSpaceDialog();
					},
					notification: 0
				});

				return result;
			});
		}
	);

	const _openSpaceDialog = () => {
		openSpaceDialog();
		isAddingNewSpace = false;
	};
</script>

<header class="center py-2 px-3 bg-gray-200">
	<div class="flex-1 max-w-screen-lg hstack">
		<div class="flex-1">
			<LogitLogoSimple height="30px" />
		</div>
		{#if $isAuthenticated && space}
			<div class="flex-1 center">
				<button onclick={_openSpaceDialog} class="capitalize">
					{space}
				</button>
			</div>
			<div class="flex-1 hstack justify-end gap-5">
				{#if $allLogsNotificationsQuery.data}
					{#each Object.entries(headerButtons) as [type, { icon, onClick }]}
						{@const spaceNotifications = $allLogsNotificationsQuery.data?.find(
							({ space: _space }) => _space === space
						)}
						{@const notificationsCount = spaceNotifications?.[type]}

						<button onclick={() => onClick(!!notificationsCount)} class="relative">
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
		<LogitLogo height="30px" />
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
				<Button onClick={() => (isAddingNewSpace = true)}>Add</Button>
			{/if}
		</div>
	</div>
</Dialog>
