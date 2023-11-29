<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { icons } from '$lib/general/icons';
	import { LogType_enum } from '$lib/types';
	import {
		getHyphenatedStringFromDate,
		replaceAllHyphensWithSpaces,
		replaceAllSpacesWithHyphens,
		stringArrayToQueryString
	} from '$lib/utils/strings';
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	import Input from './Input.svelte';
	import { useQuery } from '@sveltestack/svelte-query';
	import { selectedDate } from '$lib/stores/dates';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import PillButton from './Logs/Buttons/PillButton.svelte';

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

	const allLogsNotificationsQuery = useQuery(
		`allLogNotifications`,
		async () => {
			if (!hasPageLoaded) return;
			const queryString = stringArrayToQueryString(spaces);

			return await axios
				.get(`/log/notifications?${queryString}`)
				.then(({ data }) => data)
				.catch((err) => console.log(err));
		},

		{
			initialData: initialLogNotifications,
			refetchOnMount: false
		}
	);

	const headerButtons = [
		{
			label: 'time',
			type: LogType_enum.time,
			icon: icons.clock,
			onClick: () => {
				goto(`/${$page.params.space}/filter?type=${LogType_enum.time}`);
			}
		},
		{
			label: 'todo',
			type: LogType_enum.todo,
			icon: icons.todo,
			onClick: (hasNotification: boolean) => {
				const url = hasNotification
					? `/${$page.params.space}/filter?type=${LogType_enum.todo}&isCompleted=false`
					: `/${$page.params.space}/filter?type=${LogType_enum.todo}`;
				goto(url);
			}
		},
		{
			label: 'important',
			type: LogType_enum.important,
			icon: icons.important,
			onClick: () => {
				goto(`/${$page.params.space}/filter?type=${LogType_enum.important}`);
			}
		},
		{
			label: 'question',
			type: LogType_enum.question,
			icon: icons.question,
			onClick: (hasNotification: boolean) => {
				const url = hasNotification
					? `/${$page.params.space}/filter?type=${LogType_enum.question}&hasAnswer=false`
					: `/${$page.params.space}/filter?type=${LogType_enum.question}`;
				goto(url);
			}
		}
	];

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
</script>

<header class="center py-2 px-3 bg-gray-200">
	<div class="flex-1 max-w-screen-lg hstack">
		<div class="flex-1">
			<Button _class="bg-white bg-opacity-80 capitalize" onClick={onOpen}
				>{replaceAllHyphensWithSpaces(space)}</Button
			>
		</div>
		<div class="flex-1 hstack justify-end gap-5">
			{#each headerButtons as { icon, onClick, type }}
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
	</div>
</header>

<Dialog bind:onOpen onClose={onDialogClose} bind:dialog>
	<div class="stack gap-3">
		<div class="stack gap-4 self-center">
			{#if $allLogsNotificationsQuery?.data}
				{#each $allLogsNotificationsQuery?.data as { space, todo, question }}
					{@const onClick = () => {
						goto(
							`/${replaceAllSpacesWithHyphens(space)}/date/${getHyphenatedStringFromDate(
								new Date()
							)}`
						);
						onDialogClose();
					}}

					{@const getButtons = () => {
						const result = [
							{ label: replaceAllHyphensWithSpaces(space), onClick, notification: 0 }
						];

						if (todo)
							result.push({
								notification: todo,
								onClick: () => {
									onDialogClose();
									goto(`/${space}/filter?type=todo&isCompleted=false`);
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
					}}
					{@const buttons = getButtons()}

					<div class="hstack gap-2 items-center relative">
						<PillButton {buttons} />
					</div>
				{/each}
			{/if}
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
