<script lang="ts">
	import type { SpaceData_int } from '../../../types/general';
	import Icon from '@iconify/svelte';

	export let data: SpaceData_int;
</script>

<div class="w-full stack gap-3">
	<div class="center text-xl hStack gap-2">
		<p class="capitalize text-opacity-40 text-black">{data.space}</p>
		<p>:</p>
		<p class="capitalize">{data.time}</p>
	</div>
	<div class="w-full stack gap-6 text-xs sm:text-sm md:text-md">
		<div class="flex-col sm:flex-row center gap-2">
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
		<hr />
		<div class="flex-col sm:flex-row center gap-2">
			<div class="w-full sm:w-10/12 bg-white p-2 stack gap-2 rounded-md">
				<p class="text-opacity-20 text-black">Test subject</p>
				<p class="bg-white flex items-center">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae enim ut mi
					lobortis commodo vitae ut justo. Etiam rutrum ligula justo, sit amet elementum sapien
					ultrices eu. Praesent sit amet nisl volutpat quam fermentum suscipit. Aenean sodales ante
					sed enim porta, sit amet viverra nulla porta. Curabitur sodales pharetra.
				</p>
			</div>
			<div class="hStack gap-2 center w-2/12">
				<button class="bg-white bg-opacity-70 rounded-sm p-1"
					><Icon icon="mdi:pencil" height="25px" /></button
				>
				<button class="bg-white bg-opacity-70 rounded-sm p-1"
					><Icon icon="akar-icons:cross" height="25px" /></button
				>
			</div>
		</div>
		<div class="flex-col sm:flex-row center gap-2">
			<div class="w-full sm:w-10/12 bg-white p-2 stack gap-2 rounded-md">
				<p class="text-opacity-20 text-black">Test subject</p>
				<p class="bg-white flex items-center">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae enim ut mi
					lobortis commodo vitae ut justo. Etiam rutrum ligula justo, sit amet elementum sapien
					ultrices eu. Praesent sit amet nisl volutpat quam fermentum suscipit. Aenean sodales ante
					sed enim porta, sit amet viverra nulla porta. Curabitur sodales pharetra.
				</p>
			</div>
			<div class="hStack gap-2 center w-2/12">
				<button class="bg-white bg-opacity-70 rounded-sm p-1"
					><Icon icon="mdi:pencil" height="25px" /></button
				>
				<button class="bg-white bg-opacity-70 rounded-sm p-1"
					><Icon icon="akar-icons:cross" height="25px" /></button
				>
			</div>
		</div>
	</div>
</div>
