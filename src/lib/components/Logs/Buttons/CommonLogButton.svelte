<script lang="ts">
	export let className = '';
</script>

<button class="border-2 px-2 border-gray-100 rounded-md flex h-[30px] center {className}">
	<slot />
</button>
