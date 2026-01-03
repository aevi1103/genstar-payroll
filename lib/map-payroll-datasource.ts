import type { PayrollRecord } from "@/app/api/payroll/history/route";
import dayjs from "dayjs";
import { shortDateFormat } from "./utils";
import type { PayrollSettings } from "./db/get-payroll-settings";
import { getAdjustedClockInTime } from "./get-adjusted-clock-in-time";

// employee works mon-sat 8 hours a day
const regularHoursThreshold = 8;
const sundayDayNum = 0;

interface MapPayrollDataSourceProps {
	data: PayrollRecord[] | undefined;
	settings: PayrollSettings | undefined;
}

export const mapPayrollDataSource = ({
	data,
	settings,
}: MapPayrollDataSourceProps) => {
	const ds =
		data?.map((record) => {
			const salaryPerDay = record.users?.employee_salary?.[0]?.salary_per_day;
			const salaryPerHour = salaryPerDay
				? Number(salaryPerDay) / regularHoursThreshold
				: null;

			const { clockInTime, originalClockInTime, lateTimeInMinutes, adjusted } =
				getAdjustedClockInTime(dayjs(record.clock_in_time), settings);

			let hoursWorked = dayjs(record.clock_out_time || new Date()).diff(
				clockInTime,
				"hours",
				true,
			);

			const applyBreakHoursThreshold =
				settings?.apply_break_deduction_after_hour || 4;

			const breakHours = settings?.break_hours || 1;

			hoursWorked =
				hoursWorked > applyBreakHoursThreshold
					? hoursWorked - breakHours
					: hoursWorked;

			const localClockInDate = dayjs(record.clock_in_time)
				.toDate()
				.toLocaleDateString();

			const localClockInDateDay = dayjs(localClockInDate).day();
			const isSunday = localClockInDateDay === sundayDayNum;

			let regularHoursWorked =
				hoursWorked > regularHoursThreshold
					? regularHoursThreshold
					: hoursWorked;

			regularHoursWorked = isSunday ? 0 : regularHoursWorked;

			const adjustedHoursWorked = hoursWorked - lateTimeInMinutes / 60;

			const overtimeHoursWorked =
				hoursWorked > regularHoursThreshold
					? hoursWorked - regularHoursThreshold
					: 0;

			const amountEarned = salaryPerHour
				? salaryPerHour * Number(hoursWorked || 0)
				: null;

			const sundayHoursWorked = isSunday ? hoursWorked : 0;

			const email = record.users?.email || "";
			const fname = record.users?.user_profiles?.[0]?.first_name || "";
			const lname = record.users?.user_profiles?.[0]?.last_name || "";
			const fullName = `${fname} ${lname}`.trim();

			const weekStart = record.user_weekly_payroll?.week_start;
			const weekEnd = record.user_weekly_payroll?.week_end;
			const weekRange =
				weekStart && weekEnd
					? `${dayjs(weekStart).format(shortDateFormat)} - ${dayjs(weekEnd).format(shortDateFormat)}`
					: "";

			return {
				...record,
				originalClockInTime,
				clockInTime,
				lateTimeInMinutes,
				adjusted,
				email,
				firstName: fname,
				lastName: lname,
				fullName,
				salaryPerDay,
				salaryPerHour,
				hoursWorked,
				adjustedHoursWorked,
				regularHoursWorked,
				overtimeHoursWorked,
				sundayHoursWorked,
				amountEarned,
				isSunday,
				localClockInDate,
				localClockInDateDay,
				weekStart,
				weekEnd,
				weekRange,
				breakHours,
				is_manual: record.is_manual || false,
			};
		}) || [];

	console.log("Mapped Payroll Data Source:", ds);

	return ds;
};

export type PayrollDataSource = ReturnType<typeof mapPayrollDataSource>[number];
