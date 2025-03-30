<script lang="ts">
	import { goto } from '$app/navigation'
	import { selectedHyphenatedDateString } from '$lib/stores/dates'

	import type { SpaceData_int } from '$lib/types'
	import { replaceAllSpacesWithHyphens } from '$lib/utils/strings'
	import { onMount } from 'svelte'

	interface DatePageProps extends SvelteAllProps {
		data: SpaceData_int
	}

	const { data }: DatePageProps = $props()

	onMount(() => {
		const space = data.space ?? data.spaces[0]
		goto(`/${replaceAllSpacesWithHyphens(space)}/date/${selectedHyphenatedDateString}`)
	})
</script>
