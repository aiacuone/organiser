<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$lib/components/Button.svelte'
	import Dialog from '$lib/components/Dialog/Dialog.svelte'
	import Input from '$lib/components/Input.svelte'
	import { axios } from '$lib/general'
	import { useMutation } from '@sveltestack/svelte-query'

	import { getContext } from 'svelte'

	interface OverviewPageProps {
		data: {
			space: string
		}
	}

	const { data }: OverviewPageProps = $props()
	let dialog: HTMLDialogElement | undefined = $state()

	let onOpen: () => void = $state(() => {})
	let onClose: () => void = $state(() => {})

	const invalidateLogs: () => void = getContext('invalidateLogs')

	export const deleteSpaceMutation = useMutation(
		async (space: string) => await axios.delete(`/${space}`),
		{
			onSuccess: () => {
				invalidateLogs()
			}
		}
	)

	const onConfirmDelete = async () => {
		try {
			await $deleteSpaceMutation.mutate(data.space)
			onClose()
			goto('/')
		} catch (error) {
			console.error('Error deleting space')
		}
	}

	let inputValue: string = $state('')
</script>

<div class="center">
	<div class="max-w-(--breakpoint-lg) center stack">
		<header class="capitalize mb-6">
			{data.space}
		</header>
		<Button _class="bg-red-500" onclick={onOpen}>Delete Space</Button>
	</div>
</div>

<Dialog bind:onOpen bind:onClose bind:dialog>
	<div class="stack gap-4">
		<p><b class="text-red-500">WARNING:</b> This will delete all the logs within this space</p>

		<div class="stack gap-2">
			<p>Please enter the name <b>{data.space}</b> of the space to delete</p>
			<Input
				bind:value={inputValue}
				placeholder={`Enter ${data.space} here to delete`}
				onchange={(e:Event)=>inputValue=(e.target as HTMLInputElement).value}
			/>
			<Button
				onclick={onConfirmDelete}
				_class="self-center bg-red-500"
				isDisabled={inputValue !== data.space}>Confirm Delete</Button
			>
		</div>
		<Button onclick={onClose} _class="self-center">Close</Button>
	</div>
</Dialog>
