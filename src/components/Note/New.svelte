<script lang="ts">
	import Icon from '@iconify/svelte';

	export let background: string;
</script>

<div
	class="flex-col sm:flex-row center gap-2 p-4 w-full bg-red-500 rounded-md"
	style="background:{background}"
>
	<div class="w-full sm:w-10/12 bg-white p-2 stack rounded-md">
		<input
			type="text"
			placeholder="Subject"
			class="outline-0 text-opacity-30 w-4/12 h-[30px] text-black"
		/>
		<div
			class="w-full outline-0 input min-h-[30px] flex items-center break-normal"
			role="textbox"
			contenteditable
			on:input={(e) => console.log(e.target.innerText)}
		/>
	</div>
	<div class="hStack gap-2 center w-2/12">
		<button class="bg-white bg-opacity-70 rounded-sm p-1"
			><Icon icon="system-uicons:reset" height="25px" /></button
		>
		<button class="bg-white bg-opacity-70 rounded-sm p-1"
			><Icon icon="mdi:tick" height="25px" /></button
		>
	</div>
</div>
