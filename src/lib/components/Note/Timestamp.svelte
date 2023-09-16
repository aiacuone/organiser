<script lang="ts">
	import { getDayMonthYearFromDate } from '$lib/utils';

	export let date: Date;

	$: ({ dayString, day, month, year, hour, minutes } = getDayMonthYearFromDate(date));
</script>

<div class="hStack gap-2">
	<p>{dayString}</p>
	<p>{`${day}-${month}-${year}`}</p>
	<p>{`${hour}:${minutes}`}</p>
</div>
