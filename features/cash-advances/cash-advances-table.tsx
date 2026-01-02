"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import { TableWrapper } from "@/components/table-wrapper";
import type {
	CashAdvanceRecord,
	CashAdvances,
} from "@/lib/db/get-cash-advances";
import { StatusCellRenderer } from "./status-cell-renderer";
import { ActionsCellRenderer } from "./actions-cell-renderer";
import { useMediaQuery } from "@/hooks/use-media-query";

type CashAdvancesTableProps = {
	cashAdvances: CashAdvances;
};

export const CashAdvancesTable = ({ cashAdvances }: CashAdvancesTableProps) => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	const [colDefs] = useState<ColDef<CashAdvanceRecord>[]>([
		{
			field: "name",
			headerName: "Employee",
		},
		{
			field: "cash_advance",
			headerName: "Total Amount",
			valueFormatter: (params) => {
				return params.value
					? `₱${params.value.toLocaleString("en-PH", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}`
					: "₱0.00";
			},
		},
		{
			field: "paid_amount",
			headerName: "Paid Amount",
			valueFormatter: (params) => {
				const value = params.value || 0;
				return `₱${Number(value).toLocaleString("en-PH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`;
			},
		},
		{
			headerName: "Balance",
			valueGetter: (params) => {
				const total = Number(params.data?.cash_advance || 0);
				const paid = Number(params.data?.paid_amount || 0);
				return total - paid;
			},
			valueFormatter: (params) => {
				return `₱${Number(params.value || 0).toLocaleString("en-PH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`;
			},
		},
		{
			field: "is_paid",
			headerName: "Status",
			cellRenderer: StatusCellRenderer,
		},
		{
			field: "created_at",
			headerName: "Created",
			valueFormatter: (params) => {
				return params.value
					? formatDistanceToNow(new Date(params.value), { addSuffix: true })
					: "";
			},
		},
		{
			field: "created_by",
			headerName: "Created By",
		},
		{
			headerName: "Actions",
			cellClass: "!h-full !items-center !flex",
			pinned: isMobile ? undefined : "right",
			cellRenderer: ActionsCellRenderer,
			sortable: false,
			filter: false,
			// width: 300,
		},
	]);

	if (cashAdvances.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-muted-foreground">No cash advances found</p>
			</div>
		);
	}

	return (
		<div className="h-[90dvh] lg:flex-1">
			<TableWrapper>
				<AgGridReact
					columnDefs={colDefs}
					rowData={cashAdvances}
					getRowId={(params) => params.data?.id?.toString() || ""}
					defaultColDef={{
						filter: true,
						sortable: true,
						resizable: true,
					}}
				/>
			</TableWrapper>
		</div>
	);
};
