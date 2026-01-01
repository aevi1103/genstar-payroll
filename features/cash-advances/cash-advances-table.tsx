"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { Check, Loader2, Trash2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableWrapper } from "@/components/table-wrapper";
import {
	deleteCashAdvance,
	revertCashAdvanceToUnpaid,
} from "@/app/payroll/deductions/cash-advances/actions";
import type {
	CashAdvanceRecord,
	CashAdvances,
} from "@/lib/db/get-cash-advances";
import { PaymentDialog } from "@/features/cash-advances/payment-dialog";

type CashAdvancesTableProps = {
	cashAdvances: CashAdvances;
};

// Status cell renderer
const StatusCellRenderer = (props: ICellRendererParams<CashAdvanceRecord>) => {
	const isPaid = props.data?.is_paid;

	return isPaid ? (
		<Badge variant="default">Paid</Badge>
	) : (
		<Badge variant="secondary">Unpaid</Badge>
	);
};

// Actions cell renderer
const ActionsCellRenderer = (
	props: CustomCellRendererProps<CashAdvanceRecord>,
) => {
	const [isLoadingRevert, setIsLoadingRevert] = useState(false);
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);

	const handleRevertToUnpaid = async () => {
		if (!props.data?.id) return;

		setIsLoadingRevert(true);

		try {
			const result = await revertCashAdvanceToUnpaid(props.data.id.toString());

			if (result.success) {
				toast.success("Cash advance reverted to unpaid");
			} else {
				toast.error(result.error || "Failed to revert cash advance");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsLoadingRevert(false);
		}
	};

	const handleDelete = async () => {
		if (!props.data?.id) return;

		setIsLoadingDelete(true);

		try {
			const result = await deleteCashAdvance(props.data.id.toString());

			if (result.success) {
				toast.success("Cash advance deleted successfully");
			} else {
				toast.error(result.error || "Failed to delete cash advance");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsLoadingDelete(false);
		}
	};

	return (
		<div className="flex gap-2 justify-between w-full">
			{!props.data?.is_paid ? (
				<PaymentDialog cashAdvance={props.data}>
					<Button size="sm" variant="outline" className="flex-1">
						<Check className="mr-2 h-4 w-4" />
						Record Payment
					</Button>
				</PaymentDialog>
			) : (
				<Button
					size="sm"
					variant="outline"
					onClick={handleRevertToUnpaid}
					disabled={isLoadingRevert}
					className="flex-1"
				>
					{isLoadingRevert ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<Undo2 className="mr-2 h-4 w-4" />
							Revert to Unpaid
						</>
					)}
				</Button>
			)}

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button size="sm" variant="destructive" disabled={isLoadingDelete}>
						{isLoadingDelete ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Trash2 className="h-4 w-4" />
						)}
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Cash Advance</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this cash advance record? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export const CashAdvancesTable = ({ cashAdvances }: CashAdvancesTableProps) => {
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
			cellRenderer: ActionsCellRenderer,
			sortable: false,
			filter: false,
			width: 250,
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
	);
};
