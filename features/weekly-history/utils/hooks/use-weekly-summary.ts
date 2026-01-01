import type { PayrollDataSource } from "@/hooks/use-payroll-history-query";
import { shortDateFormat } from "@/lib/utils";
import dayjs from "dayjs";
import { useMemo } from "react";

export const mapWeeklySummaryData = (data: PayrollDataSource[]) => {
	const groupByWeek = Object.groupBy(data, (record) => {
		const weekStart = dayjs(record.week_start).format(shortDateFormat);
		const weekEnd = dayjs(record.week_end).format(shortDateFormat);
		const empId = record.user_id;
		const recordKey = `${weekStart}-${weekEnd}-${empId}`;
		return recordKey;
	});

	const dataSource = Object.entries(groupByWeek)
		.map(([recordKey, records]) => {
			const [weekStart, weekEnd, userId] = recordKey.split("-");

			const totalHoursWorked = records?.reduce(
				(acc, record) => acc + (record.hoursWorked || 0),
				0,
			);

			const totalAmountEarned = records?.reduce(
				(acc, record) => acc + (record.amountEarned || 0),
				0,
			);

			const [firstRecord] = records || [];
			const salaryPerDay = firstRecord?.salaryPerDay || 0;
			const salaryPerHour = salaryPerDay ? Number(salaryPerDay) / 8 : 0;

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
				totalHoursWorked,
				totalAmountEarned,
				details: records,
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

export const useWeeklySummary = (data: PayrollDataSource[]) => {
	const dataSource = useMemo(() => mapWeeklySummaryData(data), [data]);

	console.log({ dataSource });

	return {
		data: dataSource,
	} as {
		data: WeeklySummaryDataSource[];
	};
};
