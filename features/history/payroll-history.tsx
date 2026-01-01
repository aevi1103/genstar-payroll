"use client";
import type { ColDef, ColGroupDef } from "ag-grid-community";
import { useState } from "react";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { HistoryLoader } from "./history-loader";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { TableWrapper } from "../../components/table-wrapper";
import { shortDateFormat, formatPesoCurrency } from "@/lib/utils";
import { UserLocationDialog } from "./user-location-dialog";
import { GpsLocationBtn } from "./gps-location-btn";
import { ClockOutTime } from "./clock-out-time";
import { DeletePayrollBtn } from "./delete-payroll-btn";
import { ClockInTime } from "./clock-in-time";
import {
	type PayrollDataSource,
	usePayrollHistoryQuery,
} from "@/hooks/use-payroll-history-query";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);
dayjs.extend(duration);

export const PayrollHistory = ({ isAdmin }: { isAdmin: boolean }) => {
	const { data, error, isLoading } = usePayrollHistoryQuery({
		weekStartDate: undefined,
		weekEndDate: undefined,
	});

	const [colDefs] = useState<
		(ColDef<PayrollDataSource> | ColGroupDef<PayrollDataSource>)[]
	>([
		{
			colId: "actions",
			// headerName: "Actions",
			width: 50,
			pinned: "left",
			cellClass: "!flex !items-center !justify-center !h-full",
			cellRenderer: (params: CustomCellRendererProps<PayrollDataSource>) => {
				return <DeletePayrollBtn params={params} isAdmin={isAdmin} />;
			},
			filter: false,
			sortable: false,
			hide: !isAdmin,
		},
		{
			field: "users.user_profiles",
			headerName: "Employee",
			hide: !isAdmin,
			initialWidth: 200,
			valueGetter: (params) => {
				const profile = params.data?.users?.user_profiles?.[0];
				if (!profile) return params.data?.users?.email || "N/A";
				const firstName = profile.first_name || "";
				const middleName = profile.middle_name
					? ` ${profile.middle_name.charAt(0)}.`
					: "";
				const lastName = profile.last_name || "";
				return `${lastName}, ${firstName}${middleName}`;
			},
		},
		{
			colId: "status",
			headerName: "Status",
			initialWidth: 120,
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
			initialWidth: 230,
			valueFormatter: (params) => {
				return new Date(params.value).toLocaleString();
			},
			cellRenderer: (params: CustomCellRendererProps<PayrollDataSource>) => {
				return <ClockInTime params={params} isAdmin={isAdmin} />;
			},
		},
		{
			field: "clock_out_time",
			headerName: "Clock Out",
			initialWidth: 200,
			cellClass: "!flex !items-center !justify-center !h-full",
			cellRenderer: (params: CustomCellRendererProps<PayrollDataSource>) => {
				return <ClockOutTime params={params} isAdmin={isAdmin} />;
			},
		},

		{
			headerName: "Hours Worked",
			children: [
				{
					field: "hoursWorked",
					headerName: "Hours",
					initialWidth: 100,
					valueFormatter: (params) =>
						params.value ? params.value.toFixed(2) : "0.00",
				},
				{
					colId: "elapsedTime",
					headerName: "Elapsed Time",
					initialWidth: 150,
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
					initialWidth: 170,
					valueFormatter: (params) =>
						formatPesoCurrency(params.value as number | null),
				},
				{
					field: "salaryPerDay",
					headerName: "Salary / Day",
					initialWidth: 170,
					valueFormatter: (params) =>
						formatPesoCurrency(params.value as number | null),
				},
				{
					field: "salaryPerHour",
					initialWidth: 170,
					headerName: "Amount / Hour",
					valueFormatter: (params) =>
						formatPesoCurrency(params.value as number | null),
				},
			],
		},
		{
			headerName: "Location",
			children: [
				{
					field: "gps_location",
					headerName: "Clock In",
					cellClass: "!flex !items-center !justify-center !h-full",
					cellRenderer: (
						params: CustomCellRendererProps<PayrollDataSource>,
					) => {
						return <GpsLocationBtn params={params} type="clock_in" />;
					},
				},
				{
					field: "gps_location_clock_out",
					headerName: "Clock Out",
					cellClass: "!flex !items-center !justify-center !h-full",
					cellRenderer: (
						params: CustomCellRendererProps<PayrollDataSource>,
					) => {
						return <GpsLocationBtn params={params} type="clock_out" />;
					},
				},
			],
		},
		{
			headerName: "Date",
			children: [
				{
					field: "clock_in_date",
					initialWidth: 150,
					headerName: "Clock In",
					valueFormatter: (params) => {
						return new Date(params.value).toLocaleDateString();
					},
				},
				{
					field: "clock_out_date",
					initialWidth: 150,
					headerName: "Clock Out",
					valueFormatter: (params) => {
						return params.value
							? new Date(params.value).toLocaleDateString()
							: "Active";
					},
				},
			],
		},
		{
			headerName: "Entry Info",
			hide: !isAdmin,
			children: [
				{
					field: "created_at",
					headerName: "Created At",
					valueFormatter: (params) => {
						return new Date(params.value).toLocaleString();
					},
				},
				{
					field: "modified_at",
					headerName: "Modified At",
					valueFormatter: (params) => {
						return params.value ? new Date(params.value).toLocaleString() : "";
					},
				},
				{
					field: "is_manual",
					headerName: "Manual Entry",
				},
				{
					field: "created_by",
					headerName: "Created By",
				},
				{
					field: "modified_by",
					headerName: "Modified By",
				},
			],
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
