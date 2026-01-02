"use client";
import { usePayrollHistoryQuery } from "@/hooks/use-payroll-history-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
	useWeeklySummary,
	type WeeklySummaryDataSource,
} from "./utils/hooks/use-weekly-summary";
import type { ColDef, ColGroupDef } from "ag-grid-community";
import { TableWrapper } from "@/components/table-wrapper";
import { AgGridReact } from "ag-grid-react";
import { formatPesoCurrency } from "@/lib/utils";
import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";
import { useMapPayrollDatasource } from "@/hooks/use-map-payroll-datasource";
import { useWeeklyPayrollHistoryStore } from "@/lib/stores/use-weekly-payroll-history-store";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { CashAdvances } from "@/lib/db/get-cash-advances";
import type { PayrollDeductions } from "@/lib/db/get-payroll-deductions";

export const WeeklyPayrollHistory = ({
	settings,
	cashAdvances,
	payrollDeductions,
}: {
	settings: PayrollSettingsResponse;
	cashAdvances: CashAdvances;
	payrollDeductions: PayrollDeductions;
}) => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	const openSheet = useWeeklyPayrollHistoryStore((state) => state.openSheet);
	const setRecord = useWeeklyPayrollHistoryStore((state) => state.setRecord);

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

	const cashAdvanceDeductionRate =
		settings.data?.cash_advance_weekly_deduction_percent || 0;

	console.log({ data, weeklySummaryData, isLoading, settings });

	const [colDefs] = useState<
		(ColDef<WeeklySummaryDataSource> | ColGroupDef<WeeklySummaryDataSource>)[]
	>([
		{
			field: "name",
			headerName: "Employee Name",
			initialWidth: 200,
			initialPinned: isMobile ? undefined : "left",
		},
		{
			headerName: "Week Period",
			children: [
				{
					field: "weekStart",
					headerName: "From",
					initialWidth: 130,
				},
				{
					field: "weekEnd",
					headerName: "To",
					initialWidth: 130,
				},
			],
		},

		{
			field: "salaryPerDay",
			headerName: "Salary Per Day",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			initialWidth: 150,
		},
		{
			field: "salaryPerHour",
			headerName: "Amount Per Hour",
			valueFormatter: (params) => formatPesoCurrency(params.value),
		},
		{
			headerName: "Working Hours",
			children: [
				{
					headerName: "Working Days",
					children: [
						{
							field: "regularDaysWorked",
							headerName: "REG.",
							valueFormatter: (params) => params.value.toFixed(0),
						},
						{
							field: "totalRegularHours",
							headerName: "Hrs.",
							valueFormatter: (params) => params.value.toFixed(2),
						},
						{
							field: "late",
							headerName: "Late",
							valueFormatter: (params) => params.value.toFixed(2),
						},
						{
							colId: "totalHours",
							headerName: "Total Hrs.",
							initialWidth: 150,
							valueGetter: (params) => {
								const totalRegularHours = params.data?.totalRegularHours || 0;
								const lateHours = params.data?.late || 0;
								return totalRegularHours - lateHours;
							},
							valueFormatter: (params) => params.value.toFixed(2),
						},
					],
				},
				{
					headerName: "Overtime",
					children: [
						{
							field: "totalRegularOvertime",
							headerName: "REG. OT Hrs.",
							initialWidth: 150,
							valueFormatter: (params) => params.value.toFixed(2),
						},
						{
							field: "regulatOtMultiplier",
							headerName: "Reg. OT %",
							initialWidth: 120,
							valueFormatter: (params) => params.value.toFixed(2),
						},
						{
							field: "sundayHours",
							headerName: "SUN. OT Hrs.",
							initialWidth: 150,
							valueFormatter: (params) => params.value.toFixed(2),
						},
						{
							field: "sundayMultiplier",
							headerName: "Sun. OT %",
							initialWidth: 120,
							valueFormatter: (params) => params.value.toFixed(2),
						},
					],
				},
			],
		},
		{
			headerName: "Details Payments",
			children: [
				{
					headerName: "Regular Pay",
					children: [
						{
							field: "regularHoursPay",
							headerName: "Reg. Day Pay",
							initialWidth: 170,
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
						{
							field: "overtimePay",
							initialWidth: 170,
							headerName: "Reg. OT Pay",
						},
					],
				},
				{
					headerName: "Holiday",
					children: [
						{
							field: "sundayPay",
							headerName: "Sun. OT Pay",
							initialWidth: 170,
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
					],
				},
			],
		},
		{
			headerName: "Deductions",
			children: [
				{
					headerName: "Cash Advance",
					children: [
						{
							field: "remainingCashAdvanceBalance.remainingBalance",
							headerName: "Remaining",
							headerTooltip: "Remaining Cash Advance Balance",
							initialWidth: 130,
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
						{
							field: "remainingCashAdvanceBalance.weeklyDeductionLimit",
							headerName: `Weekly (${cashAdvanceDeductionRate}%)`,
							headerTooltip: "Cash Advance Weekly Deduction",
							initialWidth: 130,
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
					],
				},

				{
					field: "deductions.sss.weekly",
					headerName: "SSS",
					initialWidth: 130,
					valueFormatter: (params) => formatPesoCurrency(params.value),
				},
				{
					field: "deductions.pagIbig.weekly",
					headerName: "Pag-IBIG",
					initialWidth: 130,
					valueFormatter: (params) => formatPesoCurrency(params.value),
				},
			],
		},
		{
			field: "grossSalary",
			headerName: "Gross Salary",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			initialWidth: 130,
		},
		{
			field: "totalDeductions",
			headerName: "Total Deductions",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			initialWidth: 130,
		},
		{
			field: "netSalary",
			headerName: "Net Salary",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			initialWidth: 130,
		},
	]);

	return (
		<div className="h-[90dvh] lg:flex-1">
			<TableWrapper>
				<AgGridReact
					columnDefs={colDefs}
					rowData={weeklySummaryData || []}
					getRowId={(params) => params?.data?.recordKey}
					defaultColDef={{
						filter: true,
						initialWidth: 100,
					}}
					onRowClicked={(event) => {
						if (event.data) {
							setRecord(event.data);
							openSheet();
						}
					}}
				/>
			</TableWrapper>
		</div>
	);
};
