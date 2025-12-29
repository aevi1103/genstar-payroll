"use client";
import {
	AllCommunityModule,
	type ColDef,
	ModuleRegistry,
} from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PayrollRecord } from "@/app/api/payroll/history/route";
import { AgGridReact } from "ag-grid-react";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

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

	const [colDefs] = useState<ColDef<PayrollRecord>[]>([
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
				return params.value ? new Date(params.value).toLocaleString() : "N/A";
			},
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
					: "N/A";
			},
		},
		{
			field: "payroll_year",
			headerName: "Year",
		},
		{
			field: "payroll_week",
			headerName: "Week",
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
		return (
			<div className="space-y-3">
				{/* Table header skeleton */}
				<div className="flex gap-2 pb-2 border-b">
					<Skeleton className="h-8 flex-1" />
					<Skeleton className="h-8 flex-1" />
					<Skeleton className="h-8 flex-1" />
					<Skeleton className="h-8 flex-1" />
					<Skeleton className="h-8 flex-1" />
					<Skeleton className="h-8 flex-1" />
				</div>
				{/* Table rows skeleton */}
				{[...Array(5)].map((_, i) => (
					<div key={i.toString()} className="flex gap-2">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
					</div>
				))}
			</div>
		);
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

	return <AgGridReact columnDefs={colDefs} rowData={data || []} />;
};
