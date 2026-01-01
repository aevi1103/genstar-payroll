import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface TimeComponents {
	hours: number;
	minutes: number;
	seconds: number;
}

interface TimeFormatted extends TimeComponents {
	formatted: string; // "HH:mm:ss"
	display: string; // "Hh Mm Ss"
}

/**
 * Converts total hours to hours, minutes, and seconds
 * @param totalHours - The total number of hours (can be decimal)
 * @returns Object with hours, minutes, seconds, and formatted strings
 */
export function hoursToTime(totalHours: number): TimeFormatted {
	const dur = dayjs.duration(totalHours, "hours");

	const hours = dur.hours();
	const minutes = dur.minutes();
	const seconds = dur.seconds();

	// Format with zero-padding (HH:mm:ss)
	const formatted = [
		String(hours).padStart(2, "0"),
		String(minutes).padStart(2, "0"),
		String(seconds).padStart(2, "0"),
	].join(":");

	// Human-readable display
	const display = `${hours}h ${minutes}m ${seconds}s`;

	return {
		hours,
		minutes,
		seconds,
		formatted,
		display,
	};
}
