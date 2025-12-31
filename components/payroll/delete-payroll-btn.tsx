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
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { DataSource } from "./payroll-history";
import { toast } from "sonner";

export const DeletePayrollBtn = ({
	params,
	isAdmin,
}: {
	params: CustomCellRendererProps<DataSource>;
	isAdmin: boolean;
}) => {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
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
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete payroll record");
		},
	});

	const handleDelete = () => {
		if (params.data?.id) {
			deleteMutation.mutate(params.data.id.toString());
		}
	};

	// Only show delete button if user is admin or if the record belongs to them
	// For additional security, you may want to check ownership on the client side
	if (!params.data) {
		return null;
	}

	if (!isAdmin) {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
					disabled={deleteMutation.isPending}
				>
					<Trash2Icon className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
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
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
