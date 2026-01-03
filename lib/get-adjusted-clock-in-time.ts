import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Manila";

interface AdjustedClockInTimeResult {
	clockInTime: Dayjs;
	originalClockInTime: Dayjs;
	adjusted: boolean;
	lateTimeInMinutes: number;
}

export const getAdjustedClockInTime = (
	clockInTime: Dayjs,
	settings: PayrollSettingsResponse["data"],
): AdjustedClockInTimeResult => {
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

	const oneHourAfterShiftStart = shiftStartTime.add(1, "hour");

	if (clockInTime.isBefore(shiftStartTime) && clockInTime.isAfter(startOfDay)) {
		// if clock in is before shift start time but after start of day, set to shift start time
		return {
			clockInTime: shiftStartTime,
			originalClockInTime: clockInTime,
			adjusted: true,
			lateTimeInMinutes: 0,
		};
	}

	if (
		(clockInTime.isAfter(shiftStartTime) &&
			clockInTime.isBefore(gracePeridTime)) ||
		clockInTime.isSame(gracePeridTime)
	) {
		// adjust clock in time if clock is within grace period
		return {
			clockInTime: shiftStartTime,
			originalClockInTime: clockInTime,
			adjusted: true,
			lateTimeInMinutes: 0,
		};
	}

	const lateDeductionThreshold = settings?.late_deduction_minutes || 30;
	const lateDeductionTime = shiftStartTime.add(
		lateDeductionThreshold,
		"minute",
	);

	// if clock in is within grace period to late deduction, add 1 hours from shift start time
	if (
		(clockInTime.isAfter(gracePeridTime) &&
			clockInTime.isBefore(lateDeductionTime)) ||
		clockInTime.isSame(lateDeductionTime)
	) {
		const lateMinutes = 30;
		return {
			clockInTime: shiftStartTime,
			originalClockInTime: clockInTime,
			adjusted: true,
			lateTimeInMinutes: lateMinutes,
		};
	}

	if (
		(clockInTime.isAfter(lateDeductionTime) &&
			clockInTime.isBefore(oneHourAfterShiftStart)) ||
		clockInTime.isSame(oneHourAfterShiftStart)
	) {
		const lateMinutes = 60;
		return {
			clockInTime: shiftStartTime,
			originalClockInTime: clockInTime,
			adjusted: true,
			lateTimeInMinutes: lateMinutes,
		};
	}

	return {
		clockInTime: clockInTime,
		originalClockInTime: clockInTime,
		adjusted: false,
		lateTimeInMinutes: 0,
	};
};
