"use client";
import { Trash2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "@/components/ui/alert-dialog";
import type { CustomCellRendererProps } from "ag-grid-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";

export const DeletePayrollBtn = ({
	params,
	isAdmin,
}: {
	params: CustomCellRendererProps<PayrollDataSource>;
	isAdmin: boolean;
}) => {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch("/api/payroll/history", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete payroll record");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payroll-history"] });
			toast.success("Payroll record deleted successfully");
			setOpen(false);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete payroll record");
		},
	});

	const handleDelete = async () => {
		if (params.data?.id) {
			await mutateAsync(params.data.id.toString());
		}
	};

	// Only show delete button if user is admin or if the record belongs to them
	// For additional security, you may want to check ownership on the client side
	if (!params.data) {
		return null;
	}

	if (params.data.isPaid) {
		return null;
	}

	if (!isAdmin) {
		return null;
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
				disabled={isPending}
				onClick={() => {
					setOpen(true);
				}}
			>
				<Trash2Icon className="h-4 w-4" />
			</Button>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Payroll Record</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this payroll record? This action
						cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className="bg-destructive hover:bg-destructive/90"
						disabled={isPending}
					>
						{isPending ? (
							<div className="flex gap-2">
								<Spinner />
								Deleting..
							</div>
						) : (
							"Delete"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
