<script lang="ts">
	import { getDayMonthYearFromDate } from '$lib/utils';

	export let date: Date;
	export let className: string = '';

	$: ({ dayString, day, month, year, hour, minutes } = getDayMonthYearFromDate(date));
</script>

<div class="sm:gap-2 gap-none flex {className}">
	<p>{dayString}</p>
	<p>{`${day}-${month}-${year}`}</p>
	<p>{`${hour}:${minutes}`}</p>
</div>
