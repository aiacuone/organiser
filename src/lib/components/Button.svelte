<script lang="ts">
	interface Props extends SvelteAllProps {
		onclick?: (e: any) => void
		isDisabled?: boolean
		className?: string
		_class?: string
		height?: string
	}

	const {
		onclick,
		isDisabled = false,
		className,
		_class,
		height = '28px',
		children
	}: Props = $props()
</script>

<button
	{onclick}
	class=" text-sm shadow-md px-3 rounded {className} {_class} {isDisabled
		? 'opacity-40'
		: ''} {isDisabled ? 'cursor-not-allowed' : ''}"
	disabled={isDisabled}
	style={`height:${height}`}
>
	{@render children()}
</button>
