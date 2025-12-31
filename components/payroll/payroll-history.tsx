"use client";
import type { ColDef, ColGroupDef } from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PayrollRecord } from "@/app/api/payroll/history/route";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { HistoryLoader } from "./history-loader";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { TableWrapper } from "../table-wrapper";
import { shortDateFormat, formatCurrency } from "@/lib/utils";
import { UserLocationDialog } from "./user-location-dialog";
import { useLocationDialogStore } from "@/lib/stores/location-dialog-store";
import { GpsLocationBtn } from "./gps-location-btn";

dayjs.extend(duration);

const mapDataSource = (data: PayrollRecord[]) => {
	const ds = data.map((record) => {
		const salaryPerDay = record.users?.employee_salary?.[0]?.salary_per_day;
		const salaryPerHour = salaryPerDay ? Number(salaryPerDay) / 8 : null;

		const hoursWorked = dayjs(record.clock_out_time || new Date()).diff(
			dayjs(record.clock_in_time),
			"hours",
			true,
		);

		const amountEarned = salaryPerHour
			? salaryPerHour * Number(hoursWorked || 0)
			: null;

		return {
			...record,
			salaryPerDay,
			salaryPerHour,
			hoursWorked,
			amountEarned,
		};
	});

	return ds;
};

export type DataSource = ReturnType<typeof mapDataSource>[number];

export const PayrollHistory = () => {
	const { openDialog } = useLocationDialogStore();
	const { data, error, isLoading } = useQuery({
		queryKey: ["payroll-history"],
		queryFn: async () => {
			const data: PayrollRecord[] = await fetch("/api/payroll/history").then(
				(res) => res.json(),
			);

			return mapDataSource(data);
		},
		refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
	});

	console.log("PayrollHistory data:", data);

	const [colDefs] = useState<(ColDef<DataSource> | ColGroupDef<DataSource>)[]>([
		{
			colId: "status",
			headerName: "Status",
			valueGetter: (params) => {
				const clockIn = params.data?.clock_in_time;
				const clockOut = params.data?.clock_out_time;
				if (clockIn && clockOut) {
					return "Completed";
				}
				if (clockIn && !clockOut) {
					return "In Progress";
				}
				return "Not Started";
			},
			cellClass: (params) => {
				const status = params.value;
				if (status === "Completed") {
					return "text-green-600 font-medium";
				}
				if (status === "In Progress") {
					return "text-yellow-600 font-medium";
				}
				return "text-gray-600 font-medium";
			},
		},
		{
			colId: "weekRange",
			headerName: "Payroll Week",
			valueGetter: (params) => {
				if (!params.data) {
					return "N/A";
				}

				const startOdWeek = dayjs(params.data.week_start);
				const endOfWeek = dayjs(params.data.week_end);
				return `${startOdWeek.format(shortDateFormat)} - ${endOfWeek.format(shortDateFormat)}`;
			},
		},
		{
			field: "clock_in_time",
			headerName: "Clock In",
			valueFormatter: (params) => {
				return new Date(params.value).toLocaleString();
			},
		},
		{
			field: "clock_out_time",
			headerName: "Clock Out",
			valueFormatter: (params) => {
				return params.value
					? new Date(params.value).toLocaleString()
					: "Active";
			},
		},
		{
			headerName: "Location",
			children: [
				{
					field: "gps_location",
					headerName: "Clock In GPS",
					valueFormatter: (params) => {
						return params.value ? params.value : "N/A";
					},
					cellRenderer: (params: CustomCellRendererProps<DataSource>) => {
						return <GpsLocationBtn params={params} type="clock_in" />;
					},
				},
				{
					field: "gps_location_clock_out",
					headerName: "Clock Out GPS",
					valueFormatter: (params) => {
						return params.value ? params.value : "N/A";
					},
					cellRenderer: (params: CustomCellRendererProps<DataSource>) => {
						return <GpsLocationBtn params={params} type="clock_out" />;
					},
				},
			],
		},

		{
			headerName: "Hours Worked",
			children: [
				{
					field: "hoursWorked",
					headerName: "Hours",
					valueFormatter: (params) =>
						params.value ? params.value.toFixed(2) : "0.00",
				},
				{
					colId: "elapsedTime",
					headerName: "Elapsed Time",
					valueGetter: (params) => {
						const clockIn = params.data?.clock_in_time;
						const clockOut = params.data?.clock_out_time;
						if (clockIn && clockOut) {
							const duration = dayjs.duration(
								dayjs(clockOut).diff(dayjs(clockIn)),
							);
							const hours = Math.floor(duration.asHours());
							const minutes = duration.minutes();
							return `${hours}h ${minutes}m`;
						}

						const now = dayjs();
						if (clockIn && !clockOut) {
							const duration = dayjs.duration(now.diff(dayjs(clockIn)));
							const hours = Math.floor(duration.asHours());
							const minutes = duration.minutes();
							return `${hours}h ${minutes}m`;
						}

						return "Active";
					},
				},
				{
					field: "amountEarned",
					headerName: "Amount Earned",
					valueFormatter: (params) =>
						formatCurrency(params.value as number | null),
				},
				{
					field: "salaryPerDay",
					headerName: "Salary Per Day",
					valueFormatter: (params) =>
						formatCurrency(params.value as number | null),
				},
				{
					field: "salaryPerHour",
					headerName: "Amount Per Hour",
					valueFormatter: (params) =>
						formatCurrency(params.value as number | null),
				},
			],
		},

		{
			field: "clock_in_date",
			headerName: "Clock In Date",
			valueFormatter: (params) => {
				return new Date(params.value).toLocaleDateString();
			},
		},
		{
			field: "clock_out_date",
			headerName: "Clock Out Date",
			valueFormatter: (params) => {
				return params.value
					? new Date(params.value).toLocaleDateString()
					: "Active";
			},
		},
		{
			field: "created_at",
			headerName: "Created At",
			initialHide: true,
			valueFormatter: (params) => {
				return new Date(params.value).toLocaleString();
			},
		},
		{
			field: "modified_at",
			headerName: "Modified At",
			initialHide: true,
			valueFormatter: (params) => {
				return params.value ? new Date(params.value).toLocaleString() : "N/A";
			},
		},
	]);

	if (isLoading) {
		return <HistoryLoader />;
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircleIcon />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{error
						? error instanceof Error
							? error.message
							: "An error occurred while fetching payroll history."
						: ""}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<>
			<UserLocationDialog />
			<TableWrapper>
				<AgGridReact
					columnDefs={colDefs}
					rowData={data || []}
					getRowId={(params) => params?.data?.id?.toString() || ""}
					defaultColDef={{
						filter: true,
					}}
				/>
			</TableWrapper>
		</>
	);
};
