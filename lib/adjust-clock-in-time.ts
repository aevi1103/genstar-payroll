import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getPayrollSettingsData } from "./db/get-payroll-settings";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Manila";

export const adjustClockInTime = async (clockInTime: Dayjs) => {
	const settings = await getPayrollSettingsData();

	const shiftStartTime = clockInTime
		.clone()
		.tz(TZ)
		.hour(8)
		.minute(0)
		.second(0)
		.millisecond(0);

	const shiftStartGracePeriod = settings?.late_grace_period_minutes || 5;
	const gracePeridTime = shiftStartTime.add(shiftStartGracePeriod, "minute");
	const startOfDay = dayjs(clockInTime).tz(TZ).startOf("day");

	if (clockInTime.isBefore(shiftStartTime) && clockInTime.isAfter(startOfDay)) {
		// if clock in is before shift start time but after start of day, set to shift start time
		return {
			time: shiftStartTime,
			adjusted: true,
			message:
				"Clock-in time adjusted to shift start time due to early clock-in.",
		};
	}

	if (
		(clockInTime.isAfter(shiftStartTime) &&
			clockInTime.isBefore(gracePeridTime)) ||
		clockInTime.isSame(gracePeridTime)
	) {
		// adjust clock in time if clock is within grace period
		return {
			time: shiftStartTime,
			adjusted: true,
			message:
				"Clock-in time adjusted to shift start time within grace period.",
		};
	}

	const lateDeductionThreshold = settings?.late_deduction_minutes || 30;
	const lateDeductionTime = shiftStartTime.add(
		lateDeductionThreshold,
		"minute",
	);

	// if clock in is within grace period to late deduction, set to 9:00 AM
	if (
		(clockInTime.isAfter(gracePeridTime) &&
			clockInTime.isBefore(lateDeductionTime)) ||
		clockInTime.isSame(lateDeductionTime)
	) {
		return {
			time: shiftStartTime.add(1, "hour"),
			adjusted: true,
			message:
				"Clock-in time adjusted to 9:00 AM due to late clock-in beyond grace period.",
		};
	}

	// otherwise return original clock in time
	return {
		time: clockInTime,
		adjusted: false,
		message: undefined,
	};
};
