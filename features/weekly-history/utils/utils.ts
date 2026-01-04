import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";
import type { CashAdvances } from "@/lib/db/get-cash-advances";
import type { PayrollDeductions } from "@/lib/db/get-payroll-deductions";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import { shortDateFormat } from "@/lib/utils";
import dayjs from "dayjs";

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

const getWeeklyDeductions = ({
	userId,
	weekStart,
	deductions,
	cashAdvances,
	settings,
	paidInfo,
}: {
	userId: string;
	weekStart: string;
	deductions: PayrollDeductions;
	cashAdvances: CashAdvances;
	settings: PayrollSettingsResponse;
	paidInfo: PaidInfo;
}) => {
	const remainingCashAdvanceBalance = getUserRemainingCashAdvanceBalance({
		userId,
		cashAdvances,
		settings,
	});

	const yearlyDeductions = deductions.find(
		(item) => item.user_id === userId && item.year === dayjs(weekStart).year(),
	);

	const remainingCashAdvanceBalanceValue =
		remainingCashAdvanceBalance.remainingBalance;

	const weeklyCashAdvanceDeduction =
		remainingCashAdvanceBalance.weeklyDeductionLimit;

	const weeksPerYer = 52;
	const sss = yearlyDeductions?.sss || 0;
	const pagIbig = yearlyDeductions?.pag_ibig || 0;

	return {
		remainingCashAdvanceBalance: paidInfo.isPaid
			? paidInfo.deductions.remainingCashAdvanceBalance
			: remainingCashAdvanceBalanceValue,
		weeklyCashAdvanceDeduction: paidInfo.isPaid
			? paidInfo.deductions.weeklyCashAdvance
			: weeklyCashAdvanceDeduction,
		weeklySss: paidInfo.isPaid ? paidInfo.deductions.sss : sss / weeksPerYer,
		weeklyPagIbig: paidInfo.isPaid
			? paidInfo.deductions.pagibig
			: pagIbig / weeksPerYer,
	};
};

const calculateWorkHours = (records: PayrollDataSource[]) => {
	const totalRegularHours =
		records?.reduce(
			(acc, record) => acc + (record.regularHoursWorked || 0),
			0,
		) || 0;

	const totalLateMinutes =
		records?.reduce(
			(acc, record) => acc + (record.lateTimeInMinutes || 0),
			0,
		) || 0;

	const totalLateHours = totalLateMinutes / 60;

	const totalRegularOvertimeHours =
		records?.reduce(
			(acc, record) => acc + (record.overtimeHoursWorked || 0),
			0,
		) || 0;

	const sundayHours =
		records?.reduce(
			(acc, record) => acc + (record.sundayHoursWorked || 0),
			0,
		) || 0;

	const totalHours = totalRegularHours - totalLateHours;

	return {
		totalRegularHours,
		totalLateHours,
		totalLateMinutes,
		totalRegularOvertimeHours,
		totalHours,
		sundayHours,
	};
};

type CalculatedWorkedHours = ReturnType<typeof calculateWorkHours>;

const getOtMultipliers = (settings: PayrollSettingsResponse) => {
	const regularOtMultiplier = settings.data?.regular_ot_rate_percent || 1.25;
	const sundayMultiplier = settings.data?.weekend_ot_rate || 1.3;

	return {
		regularOtMultiplier,
		sundayMultiplier,
	};
};

type OtMultipliers = ReturnType<typeof getOtMultipliers>;

const calculatePayments = ({
	workedHours,
	salaryPerHour,
	otMultipliers,
	deductions,
}: {
	workedHours: CalculatedWorkedHours;
	salaryPerHour: number;
	otMultipliers: OtMultipliers;
	deductions: {
		cashAdvance: number;
		sss: number;
		pagIbig: number;
	};
}) => {
	const { totalRegularHours, totalRegularOvertimeHours, sundayHours } =
		workedHours;

	const { regularOtMultiplier, sundayMultiplier } = otMultipliers;

	const regularHoursPay = totalRegularHours * salaryPerHour;

	const overtimePay =
		totalRegularOvertimeHours * (salaryPerHour * regularOtMultiplier);

	const sundayPay = sundayHours * (salaryPerHour * sundayMultiplier);

	const grossSalary = regularHoursPay + overtimePay + sundayPay;

	const totalDeductions =
		deductions.cashAdvance + deductions.sss + deductions.pagIbig;

	const netSalary = grossSalary - totalDeductions;

	return {
		regularHoursPay,
		overtimePay,
		sundayPay,
		grossSalary,
		netSalary,
		totalDeductions,
	};
};

const getUserInfo = (data: PayrollDataSource) => {
	const firstName = data?.firstName || "";
	const lastName = data?.lastName || "";
	const name = data?.fullName || data.email || "n/a";

	return {
		userId: data.user_id,
		name,
		firstName,
		lastName,
	};
};

const getSalaryInfo = (data: PayrollDataSource) => {
	const salaryPerDay = data?.salaryPerDay || 0;
	const salaryPerHour = data?.salaryPerHour || 0;

	return {
		salaryPerDay,
		salaryPerHour,
	};
};

const getPaidInfo = (data: PayrollDataSource) => {
	const isPaid = data?.isPaid || false;
	const paidAt = data?.paidAt || null;

	return {
		isPaid,
		paidAt,
		deductions: {
			remainingCashAdvanceBalance:
				data.paiDeducrions.remainingCashAdvanceBalance || 0,
			weeklyCashAdvance: data.paiDeducrions.weeklyCashAdvance || 0,
			sss: data.paiDeducrions.sss || 0,
			pagibig: data.paiDeducrions.pagibig || 0,
		},
	};
};

type PaidInfo = ReturnType<typeof getPaidInfo>;

export interface UseWeeklySummaryProps {
	data: PayrollDataSource[];
	settings: PayrollSettingsResponse;
	cashAdvances: CashAdvances;
	payrollDeductions: PayrollDeductions;
}

const separator = "___";

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

	const dataSource = Object.entries(groupByWeek)
		.map(([recordKey, records]) => {
			const [weekStart, weekEnd, userId] = recordKey.split(separator);
			const daysWorked = records?.length || 0;

			const [firstRecord] = records || [];
			const userWeeklyId = firstRecord?.userWeeklyId || 0;

			const userInfo = getUserInfo(firstRecord);
			const otMultipliers = getOtMultipliers(settings);

			const numberOfActiveRecords =
				records?.filter((record) => !record.clock_out_time).length || 0;

			const hoursInfo = calculateWorkHours(records || []);
			const salaryInfo = getSalaryInfo(firstRecord);
			const paidInfo = getPaidInfo(firstRecord);

			const deductions = getWeeklyDeductions({
				userId,
				weekStart,
				deductions: payrollDeductions,
				cashAdvances,
				settings,
				paidInfo,
			});
			const paymentInfo = calculatePayments({
				workedHours: hoursInfo,
				salaryPerHour: salaryInfo.salaryPerHour,
				otMultipliers,
				deductions: {
					cashAdvance: deductions.weeklyCashAdvanceDeduction,
					sss: deductions.weeklySss,
					pagIbig: deductions.weeklyPagIbig,
				},
			});

			return {
				recordKey,
				numberOfActiveRecords,
				daysWorked,

				weekStart,
				weekEnd,
				userId,
				userWeeklyId: BigInt(userWeeklyId),

				otMultipliers,
				hoursInfo,
				userInfo,
				salaryInfo,
				paymentInfo,
				paidInfo,

				deductions,

				details: records,
			};
		})
		.sort(
			(a, b) =>
				new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime(),
		);

	return dataSource;
};
