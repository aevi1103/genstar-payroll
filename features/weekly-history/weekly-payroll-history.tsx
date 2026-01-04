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
import numeral from "numeral";

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
			field: "userInfo.name",
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
			field: "salaryInfo.salaryPerDay",
			headerName: "Salary Per Day",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			initialWidth: 150,
		},
		{
			field: "salaryInfo.salaryPerHour",
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
							field: "daysWorked",
							headerName: "REG.",
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
						},
						{
							field: "hoursInfo.totalRegularHours",
							headerName: "Hrs.",
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
						},
						{
							field: "hoursInfo.totalLateMinutes",
							headerName: "Late (mins)",
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
						},
						{
							field: "hoursInfo.totalHours",
							headerName: "Total Hrs.",
							initialWidth: 150,
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
						},
					],
				},
				{
					headerName: "Overtime",
					children: [
						{
							field: "hoursInfo.totalRegularOvertimeHours",
							headerName: "REG. OT Hrs.",
							initialWidth: 150,
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
						},
						{
							field: "otMultipliers.regularOtMultiplier",
							headerName: "Reg. OT %",
							initialWidth: 120,
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
						},
						{
							field: "hoursInfo.sundayHours",
							headerName: "SUN. OT Hrs.",
							initialWidth: 150,
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
						},
						{
							field: "otMultipliers.sundayMultiplier",
							headerName: "Sun. OT %",
							initialWidth: 120,
							valueFormatter: (params) =>
								numeral(params.value).format("0.[00]"),
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
							field: "paymentInfo.regularHoursPay",
							headerName: "Reg. Day Pay",
							initialWidth: 170,
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
						{
							field: "paymentInfo.overtimePay",
							initialWidth: 170,
							headerName: "Reg. OT Pay",
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
					],
				},
				{
					headerName: "Holiday",
					children: [
						{
							field: "paymentInfo.sundayPay",
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
							field: "deductions.remainingCashAdvanceBalance",
							headerName: "Remaining",
							headerTooltip: "Remaining Cash Advance Balance",
							initialWidth: 130,
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
						{
							field: "deductions.weeklyCashAdvanceDeduction",
							headerName: `Weekly (${cashAdvanceDeductionRate}%)`,
							headerTooltip: "Cash Advance Weekly Deduction",
							initialWidth: 130,
							valueFormatter: (params) => formatPesoCurrency(params.value),
						},
					],
				},

				{
					field: "deductions.weeklySss",
					headerName: "SSS",
					initialWidth: 130,
					valueFormatter: (params) => formatPesoCurrency(params.value),
				},
				{
					field: "deductions.weeklyPagIbig",
					headerName: "Pag-IBIG",
					initialWidth: 130,
					valueFormatter: (params) => formatPesoCurrency(params.value),
				},
			],
		},
		{
			field: "paymentInfo.grossSalary",
			headerName: "Gross Salary",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			initialWidth: 130,
		},
		{
			field: "paymentInfo.totalDeductions",
			headerName: "Total Deductions",
			valueFormatter: (params) => formatPesoCurrency(params.value),
			initialWidth: 130,
		},
		{
			field: "paymentInfo.netSalary",
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
					pagination
				/>
			</TableWrapper>
		</div>
	);
};
