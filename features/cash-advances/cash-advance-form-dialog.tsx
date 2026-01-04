"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import {
	cashAdvanceSchema,
	type CashAdvanceFormData,
} from "@/lib/schemas/cash-advance.schema";
import { createCashAdvance } from "@/app/payroll/deductions/cash-advances/actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Users } from "@/lib/db/get-active-employees";

type CashAdvanceFormDialogProps = {
	employees: Users;
};

export const CashAdvanceFormDialog = ({
	employees,
}: CashAdvanceFormDialogProps) => {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CashAdvanceFormData>({
		resolver: standardSchemaResolver(cashAdvanceSchema),
		defaultValues: {
			user_id: "",
			cash_advance: 0,
			is_paid: false,
		},
	});

	const onSubmit = async (data: CashAdvanceFormData) => {
		setIsSubmitting(true);

		try {
			const result = await createCashAdvance(data);

			if (result.success) {
				toast.success("Cash advance created successfully");
				form.reset();
				setOpen(false);
			} else {
				toast.error(result.error || "Failed to create cash advance");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Cash Advance
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>Add Cash Advance</DialogTitle>
					<DialogDescription>
						Create a new cash advance record for an employee
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="user_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Employee</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select an employee" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{employees.map((employee) => (
												<SelectItem key={employee.id} value={employee.id}>
													{employee.fullName || ""}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Choose the employee receiving the cash advance
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="cash_advance"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount (₱)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="0.00"
											step="0.01"
											value={field.value || ""}
											onChange={(e) => {
												const value = Number.parseFloat(e.target.value);
												field.onChange(
													e.target.value && !Number.isNaN(value) ? value : 0,
												);
											}}
										/>
									</FormControl>
									<FormDescription>
										Enter the cash advance amount in Philippine Pesos
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Create
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
