<script lang="ts">
	import { getDayMonthYearFromDate } from '../../utils';

	export let date: Date;

	$: ({ dayString, day, month, year, hour, minutes } = getDayMonthYearFromDate(date));
</script>

<div class="hStack text-xs text-opacity-20 text-black gap-2 pt-5">
	<p>{dayString}</p>
	<p>{`${day}-${month}-${year}`}</p>
	<p>{`${hour}:${minutes}`}</p>
</div>
