"use client";

import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";
import { useMapPayrollDatasource } from "@/hooks/use-map-payroll-datasource";
import { usePayrollHistoryQuery } from "@/hooks/use-payroll-history-query";
import type { CashAdvances } from "@/lib/db/get-cash-advances";
import type { PayrollDeductions } from "@/lib/db/get-payroll-deductions";
import { useWeeklySummary } from "../weekly-history/hooks/use-weekly-summary";
import { useSearchParams } from "next/navigation";
import {
	type ThirteenthMonthDataSourceItem,
	use13MonthDatasource,
} from "./hooks/use-13month-datasource";
import { useState } from "react";
import type { ColDef } from "ag-grid-community";
import { formatPesoCurrency } from "@/lib/utils";
import { TableWrapper } from "@/components/table-wrapper";
import { AgGridReact } from "ag-grid-react";

export const ThirteenthMonthTable = ({
	settings,
	cashAdvances,
	payrollDeductions,
}: {
	settings: PayrollSettingsResponse;
	cashAdvances: CashAdvances;
	payrollDeductions: PayrollDeductions;
}) => {
	const searchParams = useSearchParams();
	const startDate = searchParams.get("weekStartDate");
	const endDate = searchParams.get("weekEndDate");

	const { data: originalData, isLoading } = usePayrollHistoryQuery({
		weekStartDate: startDate || undefined,
		weekEndDate: endDate || undefined,
	});

	const { data } = useMapPayrollDatasource({
		data: originalData || [],
		settings: settings.data,
	});

	const { data: weeklySummaryData } = useWeeklySummary({
		data: data || [],
		settings,
		cashAdvances,
		payrollDeductions,
	});

	const { data: dataSource } = use13MonthDatasource(weeklySummaryData);

	const [columnDefs] = useState<ColDef<ThirteenthMonthDataSourceItem>[]>([
		{
			field: "name",
			headerName: "Employee Name",
		},
		{
			field: "totalRegularPay",
			headerName: "13th Month Pay",
			valueFormatter: (params) => formatPesoCurrency(params.value),
		},
	]);

	return (
		<TableWrapper isLoading={isLoading}>
			<AgGridReact columnDefs={columnDefs} rowData={dataSource} />
		</TableWrapper>
	);
};
