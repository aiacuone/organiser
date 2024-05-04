<script lang="ts">
	interface ButtonProps extends SvelteAllProps {
		onClick: (e: any) => void;
		isDisabled: boolean;
		className: string;
		_class: string;
		height: string;
	}

	const {
		onClick,
		isDisabled,
		className,
		_class,
		height = '28px',
		children
	}: ButtonProps = $props();
</script>

<button
	onclick={onClick}
	class=" text-sm shadow-md px-3 rounded {className} {_class} {isDisabled
		? 'opacity-40'
		: ''} {isDisabled ? 'cursor-not-allowed' : ''}"
	disabled={isDisabled}
	style={`height:${height}`}
>
	{@render children()}
</button>
