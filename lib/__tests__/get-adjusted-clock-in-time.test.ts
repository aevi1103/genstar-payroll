import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getAdjustedClockInTime } from "../get-adjusted-clock-in-time";
import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Manila";

describe("getAdjustedClockInTime", () => {
	const mockSettings: PayrollSettingsResponse["data"] = {
		late_grace_period_minutes: 5,
		late_deduction_minutes: 30,
		created_at: new Date(),
		modified_at: null,
		created_by: "",
		modified_by: null,
		working_day_hours_per_week: 0,
		regular_ot_rate_percent: 0,
		weekend_ot_rate: 0,
		break_hours: 0,
		apply_break_deduction_after_hour: 0,
		cash_advance_weekly_deduction_percent: null,
		id: BigInt(1),
	};

	const testDate = "2026-01-15"; // Use a specific date for consistency

	describe("Clock in before shift start time", () => {
		it("should adjust clock-in to shift start when clocking in early (7:30 AM)", async () => {
			const clockInTime = dayjs.tz(`${testDate} 07:30:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
			expect(result.originalClockInTime.isSame(clockInTime)).toBe(true);
		});

		it("should adjust clock-in to shift start when clocking in at 7:00 AM", async () => {
			const clockInTime = dayjs.tz(`${testDate} 07:00:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});
	});

	describe("Clock in within grace period", () => {
		it("should not adjust when clocking in at exactly 8:00 AM (on time)", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:00:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(false);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.isSame(clockInTime)).toBe(true);
			expect(result.originalClockInTime.isSame(clockInTime)).toBe(true);
		});

		it("should adjust to shift start when clocking in at 8:03 AM (within grace period)", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:03:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});

		it("should adjust to shift start when clocking in at exactly grace period end (8:05 AM)", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:05:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});
	});

	describe("Clock in after grace period but before late deduction threshold", () => {
		it("should adjust to shift start with 30 minutes late when clocking in at 8:10 AM", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:10:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(30);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});

		it("should adjust to shift start with 30 minutes late when clocking in at 8:20 AM", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:20:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(30);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});

		it("should adjust to shift start with 30 minutes late when clocking in at exactly late deduction threshold (8:30 AM)", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:30:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(30);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});
	});

	describe("Clock in after late deduction threshold but before 1 hour after shift start", () => {
		it("should adjust to shift start with 60 minutes late when clocking in at 8:35 AM", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:35:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(60);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});

		it("should adjust to shift start with 60 minutes late when clocking in at 8:50 AM", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:50:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(60);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});

		it("should adjust to shift start with 60 minutes late when clocking in at exactly 1 hour after shift start (9:00 AM)", async () => {
			const clockInTime = dayjs.tz(`${testDate} 09:00:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(60);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});
	});

	describe("Clock in after 1 hour after shift start", () => {
		it("should not adjust when clocking in at 9:05 AM", async () => {
			const clockInTime = dayjs.tz(`${testDate} 09:05:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(false);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.isSame(clockInTime)).toBe(true);
			expect(result.originalClockInTime.isSame(clockInTime)).toBe(true);
		});

		it("should not adjust when clocking in at 10:00 AM", async () => {
			const clockInTime = dayjs.tz(`${testDate} 10:00:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(false);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.isSame(clockInTime)).toBe(true);
		});

		it("should not adjust when clocking in at noon", async () => {
			const clockInTime = dayjs.tz(`${testDate} 12:00:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(false);
			expect(result.lateTimeInMinutes).toBe(0);
			expect(result.clockInTime.isSame(clockInTime)).toBe(true);
		});
	});

	describe("Custom settings", () => {
		it("should respect custom grace period (10 minutes)", async () => {
			const customSettings: PayrollSettingsResponse["data"] = {
				late_grace_period_minutes: 10,
				late_deduction_minutes: 30,
				id: BigInt(2),
				created_at: new Date(),
				modified_at: null,
				created_by: "",
				modified_by: null,
				working_day_hours_per_week: 0,
				regular_ot_rate_percent: 0,
				weekend_ot_rate: 0,
				break_hours: 0,
				apply_break_deduction_after_hour: 0,
				cash_advance_weekly_deduction_percent: null,
			};

			// 8:08 should be within grace period with 10-minute grace
			const clockInTime = dayjs.tz(`${testDate} 08:08:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, customSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(0);
		});

		it("should respect custom late deduction threshold (45 minutes)", async () => {
			const customSettings: PayrollSettingsResponse["data"] = {
				late_grace_period_minutes: 5,
				late_deduction_minutes: 45,
				id: BigInt(3),
				created_at: new Date(),
				modified_at: null,
				created_by: "",
				modified_by: null,
				working_day_hours_per_week: 0,
				regular_ot_rate_percent: 0,
				weekend_ot_rate: 0,
				break_hours: 0,
				apply_break_deduction_after_hour: 0,
				cash_advance_weekly_deduction_percent: null,
			};

			// 8:40 should be in 30-minute late zone with 45-minute threshold
			const clockInTime = dayjs.tz(`${testDate} 08:40:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, customSettings);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(30);
		});
	});

	describe("Default settings fallback", () => {
		it("should use default grace period when settings are null", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:03:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, null);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(0);
		});

		it("should use default late deduction when settings are undefined", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:20:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, undefined);

			expect(result.adjusted).toBe(true);
			expect(result.lateTimeInMinutes).toBe(30);
		});
	});

	describe("Edge cases", () => {
		it("should not adjust when clocking in at exact shift start boundary (8:00 AM)", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:00:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.adjusted).toBe(false);
			expect(result.lateTimeInMinutes).toBe(0);
		});

		it("should preserve timezone information in result", async () => {
			const clockInTime = dayjs.tz(`${testDate} 08:15:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.clockInTime.format("Z")).toBe("+08:00");
			expect(result.originalClockInTime.format("Z")).toBe("+08:00");
		});

		it("should handle different dates correctly", async () => {
			const differentDate = "2026-12-25";
			const clockInTime = dayjs.tz(`${differentDate} 08:15:00`, TZ);
			const result = await getAdjustedClockInTime(clockInTime, mockSettings);

			expect(result.clockInTime.format("YYYY-MM-DD")).toBe(differentDate);
			expect(result.clockInTime.hour()).toBe(8);
			expect(result.clockInTime.minute()).toBe(0);
		});
	});
});
