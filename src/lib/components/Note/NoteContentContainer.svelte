<script lang="ts">
	import { darkMode } from '$lib/stores';

	export let className: string = '';
	export let style: string = '';
</script>

<div
	class="flex-1 p-2 stack rounded-sm min-h-[70px] w-full bg-red-500 {className}"
	style={`${style} ;${
		$darkMode.boolean ? $darkMode.darkStyles.string : $darkMode.lightStyles.string
	}`}
>
	<slot />
</div>
