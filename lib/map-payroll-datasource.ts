import type { PayrollRecord } from "@/app/api/payroll/history/route";
import dayjs from "dayjs";
import { shortDateFormat } from "./utils";

// employee works mon-sat 8 hours a day
const regularHoursThreshold = 8;
const sundayDayNum = 0;

export const mapPayrollDataSource = (data: PayrollRecord[]) => {
	const ds = data.map((record) => {
		const salaryPerDay = record.users?.employee_salary?.[0]?.salary_per_day;
		const salaryPerHour = salaryPerDay
			? Number(salaryPerDay) / regularHoursThreshold
			: null;

		const hoursWorked = dayjs(record.clock_out_time || new Date()).diff(
			dayjs(record.clock_in_time),
			"hours",
			true,
		);

		const localClockInDate = dayjs(record.clock_in_time)
			.toDate()
			.toLocaleDateString();

		const localClockInDateDay = dayjs(localClockInDate).day();
		const isSunday = localClockInDateDay === sundayDayNum;

		let regularHoursWorked =
			hoursWorked > regularHoursThreshold ? regularHoursThreshold : hoursWorked;

		regularHoursWorked = isSunday ? 0 : regularHoursWorked;

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
			email,
			firstName: fname,
			lastName: lname,
			fullName,
			salaryPerDay,
			salaryPerHour,
			hoursWorked,
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
			is_manual: record.is_manual || false,
		};
	});

	return ds;
};

export type PayrollDataSource = ReturnType<typeof mapPayrollDataSource>[number];
