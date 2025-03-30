<script lang="ts">
	import { LogType_enum, LogListType_enum, type Log_int } from '$lib/types'
	import {
		clickOutside,
		debounce,
		getDateFromHyphenatedString,
		getHyphenatedStringFromDate,
		getListItemsFromMappedListItems,
		getLogFromMappedLog,
		getMappedLog,
		addToEndOfRaceCondition,
		onKeydown
	} from '$lib/utils'
	import { page } from '$app/stores'
	import { getContext, onMount, setContext } from 'svelte'
	import { deleteLogClient, updateLogClient } from '$lib/api/logsLocalApi'
	import {
		isAnAutofillOpen,
		unfocusStoreInput,
		whichInputIsFocused,
		currentlyEditing,
		titlesAndReferences,
		titles
	} from '$lib/stores'

	import ConfirmationDialog from '../ConfirmationDialog.svelte'
	import Input from '../Input.svelte'
	import BottomOptions from './BottomOptions.svelte'
	import ListItems from './ListItems.svelte'
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query'
	import isEqual from 'lodash.isequal'
	import { useDisclosure } from '$lib/hooks'
	import { twMerge } from 'tailwind-merge'

	interface Props {
		initialLog: Log_int
		editOnMount?: boolean
		inputAutoFocus?: boolean
	}

	let { initialLog, editOnMount, inputAutoFocus }: Props = $props()
	let log = $state(getMappedLog(initialLog))
	let isAnotherCardEditing = $derived(!!$currentlyEditing && $currentlyEditing !== log.id)
	let isEditing = $derived($currentlyEditing === log.id)
	let container: HTMLButtonElement
	let focusElements: HTMLElement[] = $state([])

	$effect(() => {
		// This exists because if the log is edited from outside the component, the log will not update. Example: When a log is changed and lastUpdated has been changed within a log, the logs will not order by lastUpdated as they should.
		log = getMappedLog(initialLog)
	})

	const onEditLog = () => ($currentlyEditing = log.id)
	const onStopEditing = () => ($currentlyEditing = null)
	const onResetNewLogType: () => void = getContext('onResetNewLogType')
	setContext('onEditLog', onEditLog)
	setContext('isEditing', () => isEditing)

	const invalidateLogs: () => Promise<void> = getContext('invalidateLogs')

	const onClickInput = (e: MouseEvent) => {
		onEditLog()

		const target = e.target as HTMLElement
		target.focus()
	}

	const onEdit = () => {
		if (!isAnotherCardEditing) {
			onEditLog()
		}
	}

	let changeReferenceInputValue: ((value: string | undefined) => void) | undefined = $state()

	const _onFocusAnswerInput = () => {
		onEditLog()
	}

	let haveValuesChanged = $derived(!isEqual(getMappedLog(initialLog), log))

	const onTitleAutoFill = (_title: string) => {
		const correspondingReference = $titlesAndReferences.find((t) => t.title === _title)?.reference

		changeReferenceInputValue && changeReferenceInputValue(correspondingReference ?? undefined)
	}

	const onResetChange = () => {
		onResetNewLogType && onResetNewLogType()
		log = getMappedLog(initialLog)

		onStopEditing()
	}

	const onTextareaEnterKeydown: () => void = () => {
		// onAddItem();
	}

	const onClickOutside = () => {
		if (isEditing) {
			if (haveValuesChanged && !$isConfirmationDialogOpen && !$whichInputIsFocused) {
				onOpenConfirmationDialog()
			} else {
				const isNewLogType = editOnMount

				if (isNewLogType) return onResetNewLogType()

				onStopEditing()
			}
		}
	}

	const queryClient = useQueryClient()

	const updateLogMutation = useMutation(updateLogClient, {
		onMutate: async (newOrUpdatedLog) => {
			await queryClient.cancelQueries('logs')
			const previousLogs: Log_int[] = queryClient.getQueryData('logs') ?? []
			queryClient.setQueryData('logs', ({ logs: previousLogs }) => {
				const filteredLogs = previousLogs.filter((log: Log_int) => log.id !== newOrUpdatedLog.id)

				const updatedLogs = [...filteredLogs, newOrUpdatedLog]

				return {
					logs: updatedLogs,
					count: updatedLogs.length
				}
			})

			return { previousLogs }
		},
		onError: (error, newTodo, context) => {
			console.error('There was an error updating log', error)
			queryClient.setQueryData('logs', context?.previousLogs)
		},
		onSettled: () => {
			invalidateLogs()
		}
	})

	const deleteLogMutation = useMutation(deleteLogClient, {
		onMutate: async (logId) => {
			await queryClient.cancelQueries('logs')
			const previousLogs = queryClient.getQueryData('logs')
			queryClient.setQueryData('logs', ({ logs: previousLogs }) => {
				const updatedLogs = previousLogs.filter((log: Log_int) => log.id !== logId)
				return {
					logs: updatedLogs,
					count: updatedLogs.length
				}
			})

			return { previousLogs }
		},
		onError: (err, context) => {
			console.error('There was an error deleting log', err)
			queryClient.setQueryData('logs', context?.previousLogs as Log_int[])
		},
		onSettled: () => {
			invalidateLogs()
		}
	})

	const onDelete = () => {
		$deleteLogMutation.mutate(log.id)
		addToEndOfRaceCondition(onStopEditing)
	}

	const onAccept = async () => {
		if (!haveValuesChanged) return onStopEditing()

		if ($page.params.date && $page.params.date !== getHyphenatedStringFromDate(log.date)) {
			const currentDate = new Date()
			const _date = new Date(getDateFromHyphenatedString($page.params.date))
			_date.setHours(currentDate.getHours())
			_date.setMinutes(currentDate.getMinutes())
			log.date = _date
		}

		log.lastUpdated = new Date()
		const updatedLog: Log_int = getLogFromMappedLog(log)

		try {
			await $updateLogMutation.mutate(updatedLog)
		} catch (error) {
			console.error('Issue updating state')
		}

		onResetNewLogType && onResetNewLogType()
		initialLog = updatedLog
		addToEndOfRaceCondition(onStopEditing)
	}

	const onAddItem = () => {
		onEditLog()

		const isCheckboxListType = log.listType === LogListType_enum.checkbox

		const doesTheLastListItemHaveValue = (() => {
			const lastListItem = log.listItems[log.listItems.length - 1]?.item
			const lastCheckboxItem = log.checkboxItems[log.checkboxItems.length - 1]?.text

			const itemValueType: Record<LogType_enum, string | number> = {
				[LogType_enum.todo]: lastCheckboxItem,
				[LogType_enum.question]:
					log.questions[log.questions.length - 1].question ||
					log.questions[log.questions.length - 1].answer,
				[LogType_enum.important]: lastListItem,
				[LogType_enum.time]: lastListItem,
				[LogType_enum.list]: isCheckboxListType ? lastCheckboxItem : lastListItem
			}

			return !!itemValueType[log.type]
		})()

		if (!doesTheLastListItemHaveValue) return

		const addListItem = () =>
			log.listItems && (log.listItems = [...log.listItems, { id: log.listItems.length, item: '' }])

		const addCheckboxItem = () =>
			log.checkboxItems &&
			(log.checkboxItems = [
				...log.checkboxItems,
				{ id: log.checkboxItems.length, isChecked: false, text: '' }
			])

		const addQuestionItem = () =>
			log.questions &&
			(log.questions = [...log.questions, { id: log.questions.length, question: '', answer: '' }])

		const addItemTypeMethods: Record<LogType_enum, () => void> = {
			[LogType_enum.todo]: addCheckboxItem,
			[LogType_enum.question]: addQuestionItem,
			[LogType_enum.important]: addListItem,
			[LogType_enum.time]: addListItem,
			[LogType_enum.list]: isCheckboxListType ? addCheckboxItem : addListItem
		}
		addItemTypeMethods[log.type]()

		focusElements = [...focusElements, focusElements[focusElements.length - 1]]

		addToEndOfRaceCondition(() => focusElements[focusElements.length - 1].focus())
	}

	const onDeleteItem = (index: number) => {
		const removeListItem = () =>
			log.listItems && (log.listItems = log.listItems.filter((_, i) => i !== index))

		const removeCheckboxItem = () =>
			log.checkboxItems && (log.checkboxItems = log.checkboxItems.filter((_, i) => i !== index))

		const removeQuestionItem = () =>
			log.questions && (log.questions = log.questions.filter((_, i) => i !== index))

		const isCheckboxListType = log.listType === LogListType_enum.checkbox

		const removeItemTypeMethods: Record<LogType_enum, () => void> = {
			[LogType_enum.todo]: removeCheckboxItem,
			[LogType_enum.question]: removeQuestionItem,
			[LogType_enum.important]: removeListItem,
			[LogType_enum.time]: removeListItem,
			[LogType_enum.list]: isCheckboxListType ? removeCheckboxItem : removeListItem
		}
		removeItemTypeMethods[log.type]()
		focusElements = focusElements.filter((_, i) => i !== index + 2)
	}

	onMount(() => {
		if (editOnMount) onEditLog()

		const keydown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === 'Enter') onAccept()
			if (e.ctrlKey && e.shiftKey && (e.key === '.' || e.key === '>')) onAddItem()
		}

		container.addEventListener('keydown', keydown)

		return () => container.removeEventListener('keydown', keydown)
	})

	const {
		onOpen: onOpenConfirmationDialog,
		isOpen: isConfirmationDialogOpen,
		onClose: onCloseConfirmationModal
	} = useDisclosure()

	const incrementDecrementPropValues: Record<LogType_enum, { min: number; max: number }> = {
		[LogType_enum.todo]: { min: 0, max: 3 },
		[LogType_enum.question]: { min: 1, max: 3 },
		[LogType_enum.important]: { min: 0, max: 3 },
		[LogType_enum.list]: { min: 0, max: 3 },
		[LogType_enum.time]: { min: 0, max: 24 }
	}

	const onIncrement = () => {
		if (log.type === LogType_enum.time) {
			log.time = log.time + 0.5

			if (!isEditing) {
				debounce(() =>
					$updateLogMutation.mutate({
						...log,
						listItems: getListItemsFromMappedListItems(log.listItems)
					})
				)
			}
		} else {
			log.rating = (log.rating + 1) as 1 | 2 | 3
		}
	}

	const onDecrement = () => {
		if (log.type === LogType_enum.time) {
			log.time = log.time - 0.5
			if (!isEditing) {
				debounce(() =>
					$updateLogMutation.mutate({
						...log,
						listItems: getListItemsFromMappedListItems(log.listItems)
					})
				)
			}
		} else {
			log.rating = (log.rating - 1) as 1 | 2 | 3
		}
	}

	const containerClasses: Record<LogType_enum, string[]> = {
		[LogType_enum.todo]: ['', 'border-dashed border-neutral-200 border p-2 gap-1'],
		[LogType_enum.question]: ['bg-neutral-100 p-1 rounded-sm', 'bg-white p-2 rounded-sm'],
		[LogType_enum.time]: ['p-1', 'shadow-md bg-white rounded-sm p-2 text-sm gap-1'],
		[LogType_enum.important]: ['', 'bg-neutral-50 p-2 gap-1 text-sm'],
		[LogType_enum.list]: ['', 'p-2 gap-1 text-sm border border-neutral-200 rounded-lg']
	}

	const onContainerKeydown = (e: KeyboardEvent) => {
		if (!isEditing || $isAnAutofillOpen) return

		unfocusStoreInput()

		const indexOfFocusedElement = focusElements.indexOf(e.target as HTMLElement)
		let indexOfNewFocusedElement: number = -1

		onKeydown(e, {
			ArrowUp: () => {
				if (indexOfFocusedElement === 0) indexOfNewFocusedElement = focusElements.length - 1
				else indexOfNewFocusedElement = indexOfFocusedElement - 1
			},
			ArrowDown: () => {
				if (indexOfFocusedElement === focusElements.length - 1) indexOfNewFocusedElement = 0
				else indexOfNewFocusedElement = indexOfFocusedElement + 1
			},
			Tab: function () {
				// Requires old style function due to referring to 'this'
				e.preventDefault()
				this.ArrowDown()
			},
			Enter: () => {
				onAccept()
			}
		})

		if (indexOfNewFocusedElement > -1) {
			focusElements[indexOfNewFocusedElement].focus()
			whichInputIsFocused.set(focusElements[indexOfNewFocusedElement])
		}
	}

	const incrementDecrementProps = $derived({
		min: incrementDecrementPropValues[log.type].min,
		max: incrementDecrementPropValues[log.type].max,
		onIncrement,
		onDecrement,
		incrementDecrementValue: log.type === LogType_enum.time ? log.time : log.rating
	})
</script>

<button
	use:clickOutside
	onclickOutside={onClickOutside}
	onkeydown={onContainerKeydown}
	bind:this={container}
>
	<div class={containerClasses[log.type][0]}>
		<div class={twMerge(containerClasses[log.type][1], 'stack')}>
			<div class={log.title || log.reference || isEditing ? 'flex' : 'hidden'}>
				<div class="stack gap-1 w-full">
					<Input
						bind:value={log.title}
						bind:input={focusElements[0]}
						autofocus={inputAutoFocus}
						placeholder="Title"
						autofillValues={$titles}
						isDisabled={!isEditing}
						onAutoFill={onTitleAutoFill}
						_class={!isEditing && !log.title ? 'hidden' : 'flex'}
						{isEditing}
						onclick={onClickInput}
					/>
					<Input
						bind:value={log.reference}
						bind:input={focusElements[1]}
						placeholder="Reference"
						isDisabled={!isEditing}
						_class={!isEditing && !log.reference ? 'hidden' : 'flex'}
						{isEditing}
						onclick={onClickInput}
					/>
				</div>
			</div>
			<div class="hstack center gap-2">
				<ListItems
					bind:focusElements
					bind:log
					{isEditing}
					onEnterKeydown={onTextareaEnterKeydown}
					{onDeleteItem}
					{onClickInput}
					{onEdit}
					onFocusAnswerInput={_onFocusAnswerInput}
				/>
			</div>
			<BottomOptions
				bind:log
				{incrementDecrementProps}
				{isEditing}
				{onAccept}
				{onAddItem}
				{onDelete}
				{onEditLog}
				{onStopEditing}
			/>
		</div>
	</div>
</button>

<ConfirmationDialog
	onConfirm={onResetChange}
	onOpen={onOpenConfirmationDialog}
	isOpen={$isConfirmationDialogOpen}
	onClose={onCloseConfirmationModal}
>
	Did you want to reset your changes?</ConfirmationDialog
>
