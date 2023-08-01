<script lang="ts">
	import type { SpaceData_int } from '../../../types/general';

	export let data: SpaceData_int;
</script>

<div class="w-full stack gap-3">
	<div class="center">
		<p class="capitalize">{data.space}</p>
		<p class="capitalize">: {data.time}</p>
	</div>
	<div class="w-full">
		<div
			class="w-9/12 outline-0 bg-white text-black p-2 rounded-md input"
			role="textbox"
			contenteditable
			on:input={(e) => console.log(e.target.innerText)}
		/>
	</div>
</div>
