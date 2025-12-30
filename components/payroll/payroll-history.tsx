"use client";
import {
	AllCommunityModule,
	type ColDef,
	type ColGroupDef,
	ModuleRegistry,
} from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PayrollRecord } from "@/app/api/payroll/history/route";
import { AgGridReact } from "ag-grid-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { HistoryLoader } from "./history-loader";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

ModuleRegistry.registerModules([AllCommunityModule]);
dayjs.extend(duration);

export const PayrollHistory = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["payroll-history"],
		queryFn: async () => {
			const data: PayrollRecord[] = await fetch("/api/payroll/history").then(
				(res) => res.json(),
			);

			return data;
		},
	});

	const [colDefs] = useState<
		(ColDef<PayrollRecord> | ColGroupDef<PayrollRecord>)[]
	>([
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
				if (!params.data?.clock_in_time) {
					return "N/A";
				}

				const startOdWeek = dayjs(params.data.clock_in_time)
					.startOf("week")
					.add(1, "day");
				const endOfWeek = dayjs(params.data.clock_in_time).endOf("week");
				return `${startOdWeek.format("MM/DD/YYYY")} - ${endOfWeek.format("MM/DD/YYYY")}`;
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
			headerName: "Hours Worked",
			children: [
				{
					colId: "hoursWorked",
					headerName: "Hours",
					valueGetter: (params) => {
						const clockIn = params.data?.clock_in_time;
						const clockOut = params.data?.clock_out_time;
						if (clockIn && clockOut) {
							const hoursDiff = dayjs(clockOut).diff(
								dayjs(clockIn),
								"hours",
								true,
							);
							return hoursDiff.toFixed(2);
						}

						const now = dayjs();
						if (clockIn && !clockOut) {
							const hoursDiff = now.diff(dayjs(clockIn), "hours", true);
							return hoursDiff.toFixed(2);
						}

						return "Active";
					},
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
			field: "payroll_year",
			headerName: "Year",
			initialHide: true,
		},
		{
			field: "payroll_week",
			headerName: "Week",
			initialHide: true,
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
		<AgGridReact
			columnDefs={colDefs}
			rowData={data || []}
			getRowId={(params) => params?.data?.id?.toString() || ""}
			defaultColDef={{
				filter: true,
			}}
		/>
	);
};
