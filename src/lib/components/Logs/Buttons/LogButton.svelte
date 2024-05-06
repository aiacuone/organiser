<script lang="ts">
	interface LogButtonProps extends SvelteAllProps {
		_class: string;
		onClick: () => void;
	}

	let { _class, onClick, children }: LogButtonProps = $props();
</script>

<button
	onclick={onClick}
	class="border-2 px-2 border-gray-100 rounded-md flex h-[30px] center {_class}"
>
	{@render children()}
</button>
