"use client";
import { usePayrollHistoryQuery } from "@/hooks/use-payroll-history-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
	useWeeklySummary,
	type WeeklySummaryDataSource,
} from "./utils/hooks/use-weekly-summary";
import type { ColDef, ColGroupDef } from "ag-grid-community";
import { TableWrapper } from "@/components/table-wrapper";
import { AgGridReact } from "ag-grid-react";
import { formatPesoCurrency } from "@/lib/utils";

export const WeeklyPayrollHistory = () => {
	const searchParams = useSearchParams();
	const startDate = searchParams.get("weekStartDate");
	const endDate = searchParams.get("weekEndDate");

	const { data, isLoading } = usePayrollHistoryQuery({
		weekStartDate: startDate || undefined,
		weekEndDate: endDate || undefined,
	});

	const { data: weeklySummaryData } = useWeeklySummary(data || []);

	console.log({ data, weeklySummaryData, isLoading });

	const [colDefs] = useState<
		(ColDef<WeeklySummaryDataSource> | ColGroupDef<WeeklySummaryDataSource>)[]
	>([
		{
			field: "name",
			headerName: "Employee Name",
			width: 200,
		},
		{
			field: "weekStart",
			headerName: "Week Starting",
			width: 150,
		},
		{
			field: "weekEnd",
			headerName: "Week Ending",
			width: 150,
		},
		{
			field: "salaryPerDay",
			headerName: "Salary Per Day",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			width: 150,
		},
		{
			field: "salaryPerHour",
			headerName: "Amount Per Hour",
			valueFormatter: (params) => formatPesoCurrency(params.value),
		},
		{
			field: "totalHoursWorked",
			headerName: "Total Hours Worked",
			valueFormatter: (params) => params.value.toFixed(2),
		},
	]);

	return (
		<TableWrapper>
			<AgGridReact
				columnDefs={colDefs}
				rowData={weeklySummaryData || []}
				getRowId={(params) => params?.data?.recordKey}
				defaultColDef={{
					filter: true,
				}}
			/>
		</TableWrapper>
	);
};
