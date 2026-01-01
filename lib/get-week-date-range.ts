import type { Dayjs } from "dayjs";

export const getWeekDateRange = (date: Dayjs) => {
	const weekStart = date.startOf("week").add(1, "day").startOf("day").toDate();
	const weekEnd = date.endOf("week").startOf("day").add(1, "day").toDate();

	return { weekStart, weekEnd };
};
