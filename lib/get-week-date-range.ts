import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Manila";

export const getWeekDateRange = (date: Dayjs) => {
	// If date is Sunday (day 0), subtract 7 days to get to the previous week
	// This ensures Sunday stays in its own week (Mon-Sun)
	const adjustedDate = date
		.clone()
		.tz(TZ)
		.subtract(date.clone().tz(TZ).day() === 0 ? 7 : 0, "day");

	const weekStart = adjustedDate
		.clone()
		.startOf("week")
		.add(1, "day")
		.startOf("day")
		.toDate();

	const weekEnd = adjustedDate
		.clone()
		.endOf("week")
		.add(1, "day")
		.endOf("day")
		.toDate();

	return { weekStart, weekEnd };
};
