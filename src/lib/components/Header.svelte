<script lang="ts">
	import { goto } from '$app/navigation';
	import { icons } from '$lib/general/icons';
	import { LogType_enum } from '$lib/types';
	import {
		getHyphenatedStringFromDate,
		replaceAllHyphensWithSpaces,
		replaceAllSpacesWithHyphens
	} from '$lib/utils/strings';
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog/Dialog.svelte';
	import Input from './Input.svelte';
	import { useQuery } from '@sveltestack/svelte-query';
	import { selectedDate } from '$lib/stores/dates';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import PillButton from './Logs/Buttons/PillButton.svelte';
	import { derived } from 'svelte/store';
	import { logIcons } from '$lib/utils';
	import { page } from '$app/stores';
	import LogitLogoSimple from '$lib/svg/logit-logo-simple.svelte';
	import LogitLogo from '$lib/svg/logit-logo.svelte';
	import { isAuthenticated } from '$lib/stores';

	export let space: string;
	export let spaces: string[];
	export let initialLogNotifications;

	let hasPageLoaded = false;
	let isAddingNewSpace: boolean = false;
	let onOpen: () => void;
	let dialog: HTMLDialogElement;
	let addInputValue: string;

	const onDialogClose = () => {
		isAddingNewSpace = false;
		dialog.close();
	};

	onMount(() => {
		hasPageLoaded = true;
	});

	const spacesQuery = useQuery(
		`spaces`,
		async () => {
			return await axios
				.get(`/spaces`)
				.then(({ data }) => data)
				.catch((err) => console.log(err));
		},
		{
			initialData: spaces,
			refetchOnMount: false
		}
	);

	const allLogsNotificationsQuery = useQuery(
		`allLogNotifications`,
		async () => {
			return await axios
				.get(`/log/notifications`, { params: { spaces: $spacesQuery.data } })
				.then(({ data }) => data)
				.catch((err) => console.log(err));
		},
		{
			initialData: initialLogNotifications,
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
		goto(
			`/${replaceAllSpacesWithHyphens(
				addInputValue.toLowerCase()
			)}/date/${getHyphenatedStringFromDate(new Date())}`
		);

		addInputValue = '';
		onDialogClose();
		$selectedDate = new Date();
	};

	const pillButtons = derived(allLogsNotificationsQuery, ($allLogsNotificationsQuery) => {
		if (!$allLogsNotificationsQuery?.data) return [];

		return $allLogsNotificationsQuery.data.map(({ space, todo, question }) => {
			const result = [
				{
					label: replaceAllHyphensWithSpaces(space),
					onClick: () => {
						goto(
							`/${replaceAllSpacesWithHyphens(space)}/date/${getHyphenatedStringFromDate(
								new Date()
							)}`
						);
						onDialogClose();
					},
					notification: 0
				}
			];

			if (todo)
				result.push({
					notification: todo,
					onClick: () => {
						onDialogClose();
						goto(`/${space}/filter?type=todo&isChecked=false`);
					},
					icon: icons.todo
				});

			if (question)
				result.push({
					notification: question,
					onClick: () => {
						onDialogClose();
						goto(`/${space}/filter?type=question&isAnswered=false`);
					},
					icon: icons.question
				});

			result.push({
				icon: icons.moreVertical,
				onClick: () => {
					goto(`/${space}/overview`);
					onDialogClose();
				},
				notification: 0
			});

			return result;
		});
	});
</script>

<header class="center py-2 px-3 bg-gray-200">
	<div class="flex-1 max-w-screen-lg hstack">
		<div class="flex-1">
			<LogitLogoSimple height="30px" />
		</div>
		{#if $isAuthenticated}
			<div class="flex-1 center">
				<button on:click={onOpen} class="capitalize">
					{space}
				</button>
			</div>
			<div class="flex-1 hstack justify-end gap-5">
				{#each Object.entries(headerButtons) as [type, { icon, onClick }]}
					{@const spaceNotifications = $allLogsNotificationsQuery.data?.find(
						({ space: _space }) => _space === space
					)}
					{@const notificationsCount = spaceNotifications?.[type]}
					<button on:click={() => onClick(!!notificationsCount)} class="relative">
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
			</div>
		{/if}
	</div>
</header>

<Dialog bind:onOpen onClose={onDialogClose} bind:dialog>
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
				<div class="hstack gap-2">
					<Input _class="border border-gray-100 px-2" autofocus bind:value={addInputValue} />
					<button class="bg-gray-50 px-2 py-1" on:click={(e) => onAddSpace(e)}>
						<Icon icon={icons.enter} />
					</button>
				</div>
			{:else}
				<Button onClick={() => (isAddingNewSpace = true)}>Add</Button>
			{/if}
		</div>
	</div>
</Dialog>
