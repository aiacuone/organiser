<script lang="ts">
	import { twMerge } from 'tailwind-merge'

	interface Props extends SvelteAllProps {
		_class: string
		onclick: () => void
	}

	let { _class, onclick, children }: Props = $props()
</script>

<button
	{onclick}
	class={twMerge(_class, `border-2 px-2 border-gray-100 rounded-md flex h-[30px] center`)}
>
	{@render children()}
</button>
