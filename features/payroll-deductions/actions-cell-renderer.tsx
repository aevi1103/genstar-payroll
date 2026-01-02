"use client";

import { toast } from "sonner";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Loader2, Trash2, Trash2Icon } from "lucide-react";

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
import { deletePayrollDeduction } from "@/app/payroll/deductions/payroll-deductions/actions";
import type { PayrollDeductionRecord } from "@/lib/db/get-payroll-deductions";
import { useState } from "react";

export const ActionsCellRenderer = (
	props: CustomCellRendererProps<PayrollDeductionRecord>,
) => {
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const recordId = props.data?.id?.toString() || "";

	const handleDelete = async () => {
		if (!recordId) return;

		setIsDeleteLoading(true);

		try {
			const result = await deletePayrollDeduction(recordId);

			if (result.success) {
				toast.success("Payroll deduction deleted successfully");
			} else {
				toast.error(result.error || "Failed to delete payroll deduction");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsDeleteLoading(false);
		}
	};

	return (
		<div className="flex w-full">
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
						disabled={isDeleteLoading}
					>
						{isDeleteLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Trash2Icon className="h-4 w-4" />
						)}
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this
							payroll deduction record from the database.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
