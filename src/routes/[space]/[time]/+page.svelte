<script lang="ts">
	import type { SpaceData_int } from '../../../types/general';

	export let data: SpaceData_int;
</script>

<div>
	<div class="center">
		<p class="capitalize">{data.space}</p>
		<p class="capitalize">: {data.time}</p>
	</div>
</div>
