<script lang="ts">
	import Icon from '@iconify/svelte'
	import Input from './Input.svelte'
	import { icons } from '$lib/general'
	import { selectedDate } from '$lib/stores'
	import { goto } from '$app/navigation'
	import { getHyphenatedStringFromDate, replaceAllSpacesWithHyphens } from '$lib/utils'

	interface Props {
		onAddSpace?: () => void
	}

	const { onAddSpace }: Props = $props()

	let addInputValue: string = $state('')

	const _onAddSpace = () => {
		goto(
			`/${replaceAllSpacesWithHyphens(
				addInputValue.toLowerCase()
			)}/date/${getHyphenatedStringFromDate(new Date())}`
		)

		addInputValue = ''
		$selectedDate = new Date()
		onAddSpace && onAddSpace()
	}
</script>

<div class="hstack gap-2">
	<Input
		bind:value={addInputValue}
		_class="border border-gray-100 px-2"
		autofocus
		onEnterKeydown={_onAddSpace}
	/>
	<button class="bg-gray-50 px-2 py-1" onclick={_onAddSpace}>
		<Icon icon={icons.enter} />
	</button>
</div>
