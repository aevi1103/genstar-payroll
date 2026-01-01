import { toast } from "sonner";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Check, FileText, Loader2, Trash2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
	deleteCashAdvance,
	revertCashAdvanceToUnpaid,
} from "@/app/payroll/deductions/cash-advances/actions";
import type { CashAdvanceRecord } from "@/lib/db/get-cash-advances";
import { PaymentDialog } from "@/features/cash-advances/payment-dialog";
import { ViewLogsDialog } from "@/features/cash-advances/view-logs-dialog";
import { useCashAdvanceStore } from "../../lib/stores/use-cash-advance-store";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const ActionsCellRenderer = (
	props: CustomCellRendererProps<CashAdvanceRecord>,
) => {
	const {
		isLoadingRevert,
		isLoadingDelete,
		setLoadingRevert,
		setLoadingDelete,
	} = useCashAdvanceStore();

	const recordId = props.data?.id?.toString() || "";
	const isRevertLoading = isLoadingRevert[recordId] || false;
	const isDeleteLoading = isLoadingDelete[recordId] || false;

	const handleRevertToUnpaid = async () => {
		if (!recordId) return;

		setLoadingRevert(recordId, true);

		try {
			const result = await revertCashAdvanceToUnpaid(recordId);

			if (result.success) {
				toast.success("Cash advance reverted to unpaid");
			} else {
				toast.error(result.error || "Failed to revert cash advance");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setLoadingRevert(recordId, false);
		}
	};

	const handleDelete = async () => {
		if (!recordId) return;

		setLoadingDelete(recordId, true);

		try {
			const result = await deleteCashAdvance(recordId);

			if (result.success) {
				toast.success("Cash advance deleted successfully");
			} else {
				toast.error(result.error || "Failed to delete cash advance");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setLoadingDelete(recordId, false);
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
					disabled={isRevertLoading}
					className="flex-1"
				>
					{isRevertLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<Undo2 className="mr-2 h-4 w-4" />
							Revert to Unpaid
						</>
					)}
				</Button>
			)}

			<Tooltip>
				<ViewLogsDialog
					cashAdvanceId={recordId}
					employeeName={props.data?.name || ""}
				>
					<TooltipTrigger asChild>
						<Button size="sm" variant="ghost" className="cursor-pointer">
							<FileText className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
				</ViewLogsDialog>
				<TooltipContent>
					<p>View payment logs</p>
				</TooltipContent>
			</Tooltip>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button size="sm" variant="destructive" disabled={isDeleteLoading}>
						{isDeleteLoading ? (
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
