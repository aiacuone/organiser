<script lang="ts">
	import type { SpaceData_int } from '../../../types/general';
	import Icon from '@iconify/svelte';

	export let data: SpaceData_int;
</script>

<div class="w-full stack gap-3">
	<div class="center text-xl">
		<p class="capitalize font-bold">{data.space}</p>
		<p class="capitalize">: {data.time}</p>
	</div>
	<div class="w-full stack gap-6">
		<div class="stack gap-2">
			<div class="hStack">
				<input
					type="text"
					placeholder="Subject"
					class="outline-0 bg-white text-black px-2 rounded-md w-4/12 h-[30px]"
				/>
				<div class="w-full justify-end hStack gap-2">
					<button class="bg-white bg-opacity-30 rounded-sm p-1"
						><Icon icon="system-uicons:reset" height="25px" /></button
					>
					<button class="bg-white bg-opacity-30 rounded-sm p-1"
						><Icon icon="mdi:tick" height="25px" /></button
					>
				</div>
			</div>
			<div
				class="w-full outline-0 bg-white text-black px-2 rounded-md input h-[30px] flex items-center"
				role="textbox"
				contenteditable
				on:input={(e) => console.log(e.target.innerText)}
			/>
		</div>
		<hr />
		<div class="hStack">
			<div class="w-10/12 bg-white p-2 stack gap-2 rounded-md">
				<p class="text-black text-opacity-20">Test subject</p>
				<p class="bg-white text-black flex items-center">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae enim ut mi
					lobortis commodo vitae ut justo. Etiam rutrum ligula justo, sit amet elementum sapien
					ultrices eu. Praesent sit amet nisl volutpat quam fermentum suscipit. Aenean sodales ante
					sed enim porta, sit amet viverra nulla porta. Curabitur sodales pharetra.
				</p>
			</div>
			<div class="hStack gap-2 center w-2/12">
				<button class="bg-white bg-opacity-30 rounded-sm p-1"
					><Icon icon="mdi:pencil" height="25px" /></button
				>
				<button class="bg-white bg-opacity-30 rounded-sm p-1"
					><Icon icon="akar-icons:cross" height="25px" /></button
				>
			</div>
		</div>
		<div class="hStack">
			<div class="w-10/12 bg-white p-2 stack gap-2 rounded-md">
				<p class="text-black text-opacity-20">Test subject</p>
				<p class="bg-white text-black flex items-center">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae enim ut mi
					lobortis commodo vitae ut justo. Etiam rutrum ligula justo, sit amet elementum sapien
					ultrices eu. Praesent sit amet nisl volutpat quam fermentum suscipit. Aenean sodales ante
					sed enim porta, sit amet viverra nulla porta. Curabitur sodales pharetra.
				</p>
			</div>
			<div class="hStack gap-2 center w-2/12">
				<button class="bg-white bg-opacity-30 rounded-sm p-1"
					><Icon icon="mdi:pencil" height="25px" /></button
				>
				<button class="bg-white bg-opacity-30 rounded-sm p-1"
					><Icon icon="akar-icons:cross" height="25px" /></button
				>
			</div>
		</div>
	</div>
</div>
