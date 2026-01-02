import dayjs, { type Dayjs } from "dayjs";
import { getPayrollSettingsData } from "./db/get-payroll-settings";

export const adjustClockInTime = async (clockInTime: Dayjs) => {
	const settings = await getPayrollSettingsData();

	const shiftStartTime = clockInTime
		.clone()
		.hour(8)
		.minute(0)
		.second(0)
		.millisecond(0);

	const shiftStartGracePeriod = settings?.late_grace_period_minutes || 5;
	const gracePeridTime = shiftStartTime.add(shiftStartGracePeriod, "minute");

	const startOfDay = dayjs(clockInTime).startOf("day");

	if (clockInTime.isBefore(shiftStartTime) && clockInTime.isAfter(startOfDay)) {
		console.log("Adjusting clock in time to shift start time", {
			originalClockInTime: clockInTime.toISOString(),
			adjustedClockInTime: shiftStartTime.toISOString(),
		});
		// if clock in is before shift start time but after start of day, set to shift start time
		return shiftStartTime;
	}

	if (
		clockInTime.isAfter(shiftStartTime) &&
		clockInTime.isBefore(gracePeridTime)
	) {
		console.log("Adjusting clock in time to shift start time", {
			originalClockInTime: clockInTime.toISOString(),
			adjustedClockInTime: shiftStartTime.toISOString(),
		});
		// adjust clock in time if clock is within grace period
		return shiftStartTime;
	}

	const lateDeductionThreshold = settings?.late_grace_period_minutes || 30;
	const lateDeductionTime = shiftStartTime.add(
		lateDeductionThreshold,
		"minute",
	);

	// if clock in is within grace period to late deduction, set to 9:00 AM
	if (
		clockInTime.isAfter(gracePeridTime) &&
		clockInTime.isBefore(lateDeductionTime)
	) {
		console.log("Adjusting clock in time to 9:00 AM", {
			originalClockInTime: clockInTime.toISOString(),
			adjustedClockInTime: shiftStartTime.add(1, "hour").toISOString(),
		});
		return shiftStartTime.add(1, "hour");
	}

	console.log("No adjustment to clock in time needed", {
		clockInTime: clockInTime.toISOString(),
	});

	// otherwise return original clock in time
	return clockInTime;
};
