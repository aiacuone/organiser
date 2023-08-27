<script lang="ts">
	export let className: string = '';
</script>

<div class="flex-1 bg-white p-2 stack rounded-sm min-h-[70px] w-full max-w-[95%] {className}">
	<slot />
</div>
