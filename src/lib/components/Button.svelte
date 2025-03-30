<script lang="ts">
	import { twMerge } from 'tailwind-merge'

	interface Props extends SvelteAllProps {
		onclick?: (e: any) => void
		isDisabled?: boolean
		_class?: string
		height?: string
	}

	const { onclick, isDisabled = false, _class, height = '28px', children }: Props = $props()
</script>

<button
	{onclick}
	class={twMerge(
		_class,
		`text-sm shadow-md px-3 rounded ${
			isDisabled ? 'opacity-40' : ''
		} ${isDisabled ? 'cursor-not-allowed' : ''}`
	)}
	disabled={isDisabled}
	style={`height:${height}`}
>
	{@render children()}
</button>
