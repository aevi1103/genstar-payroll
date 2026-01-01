import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import { shortDateFormat } from "@/lib/utils";
import dayjs from "dayjs";
import { useMemo } from "react";

interface UseWeeklySummaryProps {
	data: PayrollDataSource[];
	settings: PayrollSettingsResponse;
}

export const mapWeeklySummaryData = ({
	data,
	settings,
}: UseWeeklySummaryProps) => {
	const groupByWeek = Object.groupBy(data, (record) => {
		const weekStart = dayjs(record.weekStart).format(shortDateFormat);
		const weekEnd = dayjs(record.weekEnd).format(shortDateFormat);
		const empId = record.user_id;
		const recordKey = `${weekStart}-${weekEnd}-${empId}`;
		return recordKey;
	});

	const dataSource = Object.entries(groupByWeek)
		.map(([recordKey, records]) => {
			const [weekStart, weekEnd, userId] = recordKey.split("-");

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
