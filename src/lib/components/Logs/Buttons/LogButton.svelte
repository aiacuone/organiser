<script lang="ts">
	export let className = '';
	export let onClick: (() => void) | undefined = undefined;
</script>

<button
	on:click={onClick}
	class="border-2 px-2 border-gray-100 rounded-md flex h-[30px] center {className}"
>
	<slot />
</button>
