import type { WeeklySummaryDataSource } from "@/features/weekly-history/hooks/use-weekly-summary";
import { useMemo } from "react";

const separator = "___";

const mapDataSource = (data: WeeklySummaryDataSource[]) => {
	const groupByUser = Object.groupBy(data, (item) => {
		const groupKey = [item.userId, item.userInfo.name].join(separator);
		return groupKey;
	});

	const mappedData = Object.entries(groupByUser).map(([groupKey, records]) => {
		const [userId, name] = groupKey.split(separator);

		const totalRegularPay = records?.reduce(
			(sum, record) => sum + (record.paymentInfo.regularHoursPay || 0),
			0,
		);

		return {
			userId,
			name,
			totalRegularPay,
			records,
		};
	});

	return mappedData;
};

export type ThirteenthMonthDataSource = ReturnType<typeof mapDataSource>;
export type ThirteenthMonthDataSourceItem = ThirteenthMonthDataSource[number];

export const use13MonthDatasource = (data: WeeklySummaryDataSource[]) => {
	const mappedData = useMemo(() => mapDataSource(data), [data]);

	return {
		data: mappedData,
	};
};
