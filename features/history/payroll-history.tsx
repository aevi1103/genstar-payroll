"use client";
import type { ColDef, ColGroupDef } from "ag-grid-community";
import { useRef, useState } from "react";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { HistoryLoader } from "./history-loader";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { TableWrapper } from "../../components/table-wrapper";
import { formatPesoCurrency } from "@/lib/utils";
import { GpsLocationBtn } from "./gps-location-btn";
import { ClockOutTime } from "./clock-out-time";
import { DeletePayrollBtn } from "./delete-payroll-btn";
import { ClockInTime } from "./clock-in-time";
import { usePayrollHistoryQuery } from "@/hooks/use-payroll-history-query";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import { useMapPayrollDatasource } from "@/hooks/use-map-payroll-datasource";
import type { PayrollSettings } from "@/lib/db/get-payroll-settings";
import { hoursToTime } from "@/lib/convert-hours-to-duration";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { uePayrollHistoryStore } from "@/lib/stores/use-payroll-history-store";

dayjs.extend(duration);

export const PayrollHistory = ({
	isAdmin,
	settings,
}: { isAdmin: boolean; settings: PayrollSettings }) => {
	const params = useSearchParams();
	const weekStart = params.get("weekStartDate");
	const weekEnd = params.get("weekEndDate");

	const openSheet = uePayrollHistoryStore((state) => state.openSheet);
	const setRecord = uePayrollHistoryStore((state) => state.setRecord);

	const {
		data: originalData,
		error,
		isLoading,
	} = usePayrollHistoryQuery({
		weekStartDate: weekStart || undefined,
		weekEndDate: weekEnd || undefined,
	});

	const gridRef = useRef<AgGridReact<PayrollDataSource>>(null);

	const { data } = useMapPayrollDatasource({
		data: originalData || [],
		settings,
	});

	const [colDefs] = useState<
		(ColDef<PayrollDataSource> | ColGroupDef<PayrollDataSource>)[]
	>([
		{
			colId: "actions",
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

				if (!firstName) return params.data?.users?.email || "N/A";

				const middleName = profile.middle_name
					? ` ${profile.middle_name.charAt(0)}.`
					: "";
				const lastName = profile.last_name || "";
				return `${lastName}, ${firstName}${middleName}`;
			},
			cellClass: "cursor-pointer text-blue-600 font-semibold hover:underline",
			tooltipValueGetter: () => "View Details",
			onCellClicked: (params) => {
				if (!params.data) {
					return;
				}

				setRecord(params.data);
				openSheet();
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

			cellRenderer: (params: CustomCellRendererProps<PayrollDataSource>) => {
				const status = params.value;

				if (status === "Completed") {
					return <Badge variant={"default"}>Completed</Badge>;
				}

				if (status === "In Progress") {
					return <Badge variant={"secondary"}>In Progress</Badge>;
				}

				return <Badge variant={"secondary"}>Not Started</Badge>;
			},
		},
		{
			field: "weekRange",
			headerName: "Payroll Week",
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
					colId: "hoursWorked",
					headerName: "Elapsed Time",
					initialWidth: 150,
					valueFormatter: (params) => {
						const hours = params.data?.hoursWorked || 0;
						const durationObj = hoursToTime(hours);
						return durationObj.formatted;
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
						return params.value
							? formatDistanceToNow(new Date(params.value), { addSuffix: true })
							: "";
					},
				},
				{
					field: "modified_at",
					headerName: "Modified At",
					valueFormatter: (params) => {
						return params.value
							? formatDistanceToNow(new Date(params.value), { addSuffix: true })
							: "";
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
				{
					field: "id",
					headerName: "Payroll ID",
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
		<div className="h-full flex flex-col gap-2">
			<Input
				placeholder="Search..."
				onChange={(e) => {
					gridRef.current?.api.setGridOption("quickFilterText", e.target.value);
				}}
			/>
			<div className="h-[90dvh] lg:flex-1">
				<TableWrapper>
					<AgGridReact
						ref={gridRef}
						columnDefs={colDefs}
						rowData={data || []}
						getRowId={(params) => params?.data?.id?.toString() || ""}
						defaultColDef={{
							filter: true,
						}}
					/>
				</TableWrapper>
			</div>
		</div>
	);
};
