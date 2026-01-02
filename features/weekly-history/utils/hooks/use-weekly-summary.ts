import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";
import type { CashAdvances } from "@/lib/db/get-cash-advances";
import type { PayrollDeductions } from "@/lib/db/get-payroll-deductions";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import { shortDateFormat } from "@/lib/utils";
import dayjs from "dayjs";
import { useMemo } from "react";

interface UseWeeklySummaryProps {
	data: PayrollDataSource[];
	settings: PayrollSettingsResponse;
	cashAdvances: CashAdvances;
	payrollDeductions: PayrollDeductions;
}

const separator = "___";

const getUserRemainingCashAdvanceBalance = ({
	userId,
	cashAdvances,
	settings,
}: {
	userId: string;
	cashAdvances: CashAdvances;
	settings: PayrollSettingsResponse;
}) => {
	const records = cashAdvances.filter((ca) => ca.user_id === userId);

	if (records.length === 0) {
		return {
			remainingBalance: 0,
			weeklyDeductionLimit: 0,
		};
	}

	const totalCashAdvance = records.reduce(
		(acc, ca) => acc + Number(ca.cash_advance),
		0,
	);

	const totalPayments = records.reduce(
		(acc, ca) => acc + Number(ca.paid_amount),
		0,
	);

	const weeklyCashAdvanceDeductionRate =
		settings.data?.cash_advance_weekly_deduction_percent || 0;
	const remainingBalance = totalCashAdvance - totalPayments;
	const weeklyDeductionLimit =
		(weeklyCashAdvanceDeductionRate / 100) * remainingBalance;

	return {
		remainingBalance: totalCashAdvance - totalPayments,
		weeklyDeductionLimit,
	};
};

const getSSSContribution = ({
	userId,
	weekStart,
	deductions,
}: {
	userId: string;
	weekStart: string;
	deductions: PayrollDeductions;
}) => {
	const yearlyDeductions = deductions.find(
		(item) => item.user_id === userId && item.year === dayjs(weekStart).year(),
	);

	if (!yearlyDeductions) {
		return {
			sss: {
				yearly: 0,
				weekly: 0,
			},
			pagIbig: {
				yearly: 0,
				weekly: 0,
			},
		};
	}

	const weeksPerYer = 52;
	const sss = yearlyDeductions.sss || 0;
	const pag_ibig = yearlyDeductions.pag_ibig || 0;

	return {
		sss: {
			yearly: sss,
			weekly: sss / weeksPerYer,
		},
		pagIbig: {
			yearly: pag_ibig,
			weekly: pag_ibig / weeksPerYer,
		},
	};
};

export const mapWeeklySummaryData = ({
	data,
	settings,
	cashAdvances,
	payrollDeductions,
}: UseWeeklySummaryProps) => {
	const groupByWeek = Object.groupBy(data, (record) => {
		const weekStart = dayjs(record.weekStart).format(shortDateFormat);
		const weekEnd = dayjs(record.weekEnd).format(shortDateFormat);
		const empId = record.user_id;
		const recordKey = [weekStart, weekEnd, empId].join(separator);
		return recordKey;
	});

	console.log({ cashAdvances, payrollDeductions });

	const dataSource = Object.entries(groupByWeek)
		.map(([recordKey, records]) => {
			const [weekStart, weekEnd, userId] = recordKey.split(separator);

			const totalRegularHours =
				records?.reduce(
					(acc, record) => acc + (record.regularHoursWorked || 0),
					0,
				) || 0;

			const totalRegularOvertime =
				records?.reduce(
					(acc, record) => acc + (record.overtimeHoursWorked || 0),
					0,
				) || 0;

			const sundayHours =
				records?.reduce(
					(acc, record) => acc + (record.sundayHoursWorked || 0),
					0,
				) || 0;

			const [firstRecord] = records || [];
			const salaryPerDay = firstRecord?.salaryPerDay || 0;
			const salaryPerHour = salaryPerDay ? Number(salaryPerDay) / 8 : 0;

			const regularOtMultiplier =
				settings.data?.regular_ot_rate_percent || 1.25;
			const sundayMultiplier = settings.data?.weekend_ot_rate || 1.3;

			const regularHoursPay = totalRegularHours * salaryPerHour;

			const overtimePay =
				totalRegularOvertime * (salaryPerHour * regularOtMultiplier);

			const sundayPay = sundayHours * (salaryPerHour * sundayMultiplier);

			const totalPay = regularHoursPay + overtimePay + sundayPay;

			const regularDaysWorked = totalRegularHours / 8;

			const firstName = firstRecord?.firstName || "";
			const lastName = firstRecord?.lastName || "";
			const name = firstRecord?.fullName || firstRecord.email || "n/a";

			const remainingCashAdvanceBalance = getUserRemainingCashAdvanceBalance({
				userId,
				cashAdvances,
				settings,
			});

			const deductions = getSSSContribution({
				userId,
				weekStart,
				deductions: payrollDeductions,
			});

			const grossSalary = regularHoursPay + overtimePay + sundayPay;
			const totalDeductions =
				remainingCashAdvanceBalance.weeklyDeductionLimit +
				deductions.sss.weekly +
				deductions.pagIbig.weekly;
			const netSalary = grossSalary - totalDeductions;

			return {
				recordKey,
				weekStart,
				weekEnd,
				userId,
				name,
				firstName,
				lastName,
				salaryPerDay,
				salaryPerHour,
				totalRegularHours,
				totalRegularOvertime,
				sundayHours,
				regularHoursPay,
				overtimePay,
				sundayPay,
				totalPay,
				regulatOtMultiplier: regularOtMultiplier,
				sundayMultiplier,
				regularDaysWorked,
				details: records,
				late: 0,

				remainingCashAdvanceBalance,
				deductions,

				grossSalary,
				totalDeductions,
				netSalary,
			};
		})
		.sort(
			(a, b) =>
				new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime(),
		);

	return dataSource;
};

export type WeeklySummaryDataSource = ReturnType<
	typeof mapWeeklySummaryData
>[number];

export const useWeeklySummary = (params: UseWeeklySummaryProps) => {
	const dataSource = useMemo(() => mapWeeklySummaryData(params), [params]);

	console.log({ dataSource });

	return {
		data: dataSource,
	} as {
		data: WeeklySummaryDataSource[];
	};
};
