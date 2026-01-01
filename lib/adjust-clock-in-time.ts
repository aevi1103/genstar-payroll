import dayjs, { type Dayjs } from "dayjs";
import { getPayrollSettings } from "./db/get-payroll-settings";

export const adjustClockInTime = async (clockInTime: Dayjs) => {
	const settings = await getPayrollSettings();

	const shiftStartTime = dayjs(clockInTime)
		.set("hour", 8)
		.set("minute", 0)
		.set("second", 0)
		.set("millisecond", 0);

	const shiftStartGracePeriod = settings?.late_grace_period_minutes || 5;
	const gracePeridTime = shiftStartTime.add(shiftStartGracePeriod, "minute");

	// adjust clock in time if clock is within grace period
	if (
		clockInTime.isAfter(shiftStartTime) &&
		clockInTime.isBefore(gracePeridTime)
	) {
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
		return shiftStartTime.add(1, "hour");
	}

	// otherwise return original clock in time
	return clockInTime;
};
