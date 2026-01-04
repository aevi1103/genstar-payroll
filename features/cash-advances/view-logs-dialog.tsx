"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { FileText, Loader2 } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCashAdvancePaymentLogs } from "@/app/payroll/deductions/cash-advances/actions";
import { TableWrapper } from "@/components/table-wrapper";

type PaymentLog = {
	id: string;
	created_at: string;
	payment: number;
	current_balance: number;
	created_by: string;
	is_auto: boolean | null;
};

type ViewLogsDialogProps = {
	cashAdvanceId: string;
	employeeName: string;
	children?: React.ReactNode;
};

export const ViewLogsDialog = ({
	cashAdvanceId,
	employeeName,
	children,
}: ViewLogsDialogProps) => {
	const [open, setOpen] = useState(false);
	const [logs, setLogs] = useState<PaymentLog[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const loadLogs = useMemo(
		() => async () => {
			setIsLoading(true);
			try {
				const data = await getCashAdvancePaymentLogs(cashAdvanceId);
				setLogs(data);
			} catch (error) {
				toast.error("Failed to load payment logs");
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		},
		[cashAdvanceId],
	);

	useEffect(() => {
		if (open) {
			loadLogs();
		}
	}, [open, loadLogs]);

	const columnDefs = useMemo<ColDef<PaymentLog>[]>(() => {
		const getPaymentType = (payment: number) => {
			if (payment === 0) {
				return { label: "Created", variant: "outline" as const };
			}
			if (payment < 0) {
				return { label: "Reverted", variant: "destructive" as const };
			}
			return { label: "Payment", variant: "default" as const };
		};

		return [
			{
				headerName: "Date",
				field: "created_at",
				initialWidth: 200,
				valueFormatter: (params) => format(new Date(params.value), "PPp"),
				cellClass: "font-medium",
			},
			{
				headerName: "Type",
				field: "payment",
				cellRenderer: (params: { value: number }) => {
					const paymentType = getPaymentType(params.value);
					return (
						<div className="flex items-center h-full">
							<Badge variant={paymentType.variant}>{paymentType.label}</Badge>
						</div>
					);
				},
			},
			{
				headerName: "Payment",
				field: "payment",

				type: "rightAligned",
				cellRenderer: (params: { value: number }) => {
					const value = params.value;
					const className =
						value < 0
							? "text-destructive font-semibold"
							: value > 0
								? "text-green-600 dark:text-green-400 font-semibold"
								: "text-muted-foreground";
					return (
						<span className={className}>
							{value !== 0 && (value > 0 ? "+" : "")}₱
							{Math.abs(value).toLocaleString("en-PH", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
					);
				},
			},
			{
				headerName: "Balance",
				field: "current_balance",

				type: "rightAligned",
				valueFormatter: (params) =>
					`₱${params.value.toLocaleString("en-PH", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}`,
				cellClass: "font-medium",
			},
			{
				headerName: "Created By",
				field: "created_by",
			},
			{
				headerName: "Time Ago",
				field: "created_at",

				valueFormatter: (params) =>
					formatDistanceToNow(new Date(params.value), { addSuffix: true }),
				cellClass: "text-muted-foreground",
			},
		];
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button size="sm" variant="ghost">
						<FileText className="h-4 w-4" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="lg:max-w-[70vw]!  flex flex-col">
				<DialogHeader>
					<DialogTitle>Payment Logs</DialogTitle>
					<DialogDescription>
						Payment history for {employeeName}
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : logs.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-muted-foreground">No payment logs found</p>
					</div>
				) : (
					<div className="h-75">
						<TableWrapper withWrapper={false}>
							<AgGridReact<PaymentLog>
								rowData={logs}
								columnDefs={columnDefs}
								defaultColDef={{
									initialWidth: 150,
								}}
							/>
						</TableWrapper>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
