"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { ColDef, CellValueChangedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import { TableWrapper } from "@/components/table-wrapper";
import type {
	PayrollDeductionRecord,
	PayrollDeductions,
} from "@/lib/db/get-payroll-deductions";
import { ActionsCellRenderer } from "./actions-cell-renderer";
import { updatePayrollDeduction } from "@/app/payroll/deductions/payroll-deductions/actions";

type PayrollDeductionsTableProps = {
	deductions: PayrollDeductions;
};

export const PayrollDeductionsTable = ({
	deductions,
}: PayrollDeductionsTableProps) => {
	const handleCellValueChanged = async (
		event: CellValueChangedEvent<PayrollDeductionRecord>,
	) => {
		if (!event.data) return;

		const { id, user_id, year, sss, pag_ibig, tax } = event.data;

		try {
			const result = await updatePayrollDeduction(id.toString(), {
				user_id,
				year,
				sss,
				pag_ibig: pag_ibig ?? null,
				tax: tax ?? null,
			});

			if (result.success) {
				toast.success("Deduction updated successfully");
			} else {
				toast.error(result.error || "Failed to update deduction");
				// Revert the change
				event.node.setData(event.data);
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error("Error updating deduction:", error);
			// Revert the change
			event.node.setData(event.data);
		}
	};

	const [colDefs] = useState<ColDef<PayrollDeductionRecord>[]>([
		{
			field: "name",
			headerName: "Employee",
			minWidth: 200,
		},
		{
			field: "year",
			headerName: "Year",
			width: 100,
			editable: true,
			cellEditor: "agNumberCellEditor",
			cellEditorParams: {
				min: 2000,
				max: 2100,
				precision: 0,
			},
		},
		{
			field: "sss",
			headerName: "SSS",
			valueFormatter: (params) => {
				return params.value
					? `₱${params.value.toLocaleString("en-PH", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}`
					: "₱0.00";
			},
			width: 130,
			editable: true,
			cellEditor: "agNumberCellEditor",
			cellEditorParams: {
				min: 0,
				max: 100000,
				precision: 2,
			},
		},
		{
			field: "pag_ibig",
			headerName: "PAG-IBIG",
			valueFormatter: (params) => {
				const value = params.value || 0;
				return `₱${Number(value).toLocaleString("en-PH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`;
			},
			width: 130,
			editable: true,
			cellEditor: "agNumberCellEditor",
			cellEditorParams: {
				min: 0,
				max: 100000,
				precision: 2,
			},
		},
		{
			field: "tax",
			headerName: "Tax",
			valueFormatter: (params) => {
				const value = params.value || 0;
				return `₱${Number(value).toLocaleString("en-PH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`;
			},
			width: 130,
			editable: true,
			cellEditor: "agNumberCellEditor",
			cellEditorParams: {
				min: 0,
				max: 100000,
				precision: 2,
			},
		},
		{
			headerName: "Total Deductions",
			valueGetter: (params) => {
				const sss = Number(params.data?.sss || 0);
				const pagIbig = Number(params.data?.pag_ibig || 0);
				const tax = Number(params.data?.tax || 0);
				return sss + pagIbig + tax;
			},
			valueFormatter: (params) => {
				return `₱${Number(params.value || 0).toLocaleString("en-PH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`;
			},
			width: 150,
		},
		{
			field: "created_at",
			headerName: "Created",
			valueFormatter: (params) => {
				return params.value
					? formatDistanceToNow(new Date(params.value), { addSuffix: true })
					: "";
			},
			width: 150,
		},
		{
			field: "created_by",
			headerName: "Created By",
			minWidth: 150,
		},
		{
			headerName: "Actions",
			cellClass: "!h-full !items-center !flex",
			pinned: "right",
			cellRenderer: ActionsCellRenderer,
			sortable: false,
			filter: false,
			width: 150,
		},
	]);

	if (deductions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-muted-foreground">No payroll deductions found</p>
			</div>
		);
	}

	return (
		<TableWrapper>
			<AgGridReact
				columnDefs={colDefs}
				rowData={deductions}
				getRowId={(params) => params.data?.id?.toString() || ""}
				defaultColDef={{
					filter: true,
					sortable: true,
					resizable: true,
				}}
				onCellValueChanged={handleCellValueChanged}
				stopEditingWhenCellsLoseFocus
			/>
		</TableWrapper>
	);
};
