"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import {
	payrollDeductionsSchema,
	type PayrollDeductionsFormData,
} from "@/lib/schemas/payroll-deductions.schema";
import { createPayrollDeduction } from "@/app/payroll/deductions/payroll-deductions/actions";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserProfiles } from "@/lib/db/get-user-profiles";

type PayrollDeductionsFormDialogProps = {
	employees: UserProfiles;
};

export const PayrollDeductionsFormDialog = ({
	employees,
}: PayrollDeductionsFormDialogProps) => {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [serverError, setServerError] = useState<string>("");

	const currentYear = new Date().getFullYear();

	const form = useForm<PayrollDeductionsFormData>({
		resolver: standardSchemaResolver(payrollDeductionsSchema),
		defaultValues: {
			user_id: "",
			year: currentYear,
			sss: undefined,
			pag_ibig: null,
			tax: null,
		},
	});

	const onSubmit = async (data: PayrollDeductionsFormData) => {
		setIsSubmitting(true);
		setServerError(""); // Clear previous errors

		try {
			const result = await createPayrollDeduction(data);

			if (result.success) {
				toast.success("Payroll deduction created successfully");
				form.reset({
					user_id: "",
					year: currentYear,
					sss: undefined,
					pag_ibig: null,
					tax: null,
				});
				setServerError("");
				setOpen(false);
			} else {
				const errorMessage =
					result.error || "Failed to create payroll deduction";
				setServerError(errorMessage);
				toast.error(errorMessage);
			}
		} catch (error) {
			const errorMessage = "An unexpected error occurred";
			setServerError(errorMessage);
			toast.error(errorMessage);
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
					Add Deduction
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>Add Payroll Deduction</DialogTitle>
					<DialogDescription>
						Add a new payroll deduction record for an employee. Only one record
						per employee per year is allowed.
					</DialogDescription>
				</DialogHeader>

				{serverError && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{serverError}</AlertDescription>
					</Alert>
				)}

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="user_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Employee <span className="text-destructive">*</span>
									</FormLabel>
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
													{employee.name || ""}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Choose the employee for the deduction
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="year"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Year <span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder={currentYear.toString()}
											value={field.value || ""}
											onChange={(e) => {
												const value = Number.parseInt(e.target.value);
												field.onChange(
													e.target.value && !Number.isNaN(value)
														? value
														: undefined,
												);
											}}
										/>
									</FormControl>
									<FormDescription>
										The year for these deductions
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sss"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										SSS (₱) <span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="0.00"
											step="0.01"
											value={field.value ?? ""}
											onChange={(e) => {
												const value = Number.parseFloat(e.target.value);
												field.onChange(
													e.target.value && !Number.isNaN(value)
														? value
														: undefined,
												);
											}}
										/>
									</FormControl>
									<FormDescription>
										SSS deduction amount in Philippine Pesos
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="pag_ibig"
							render={({ field }) => (
								<FormItem>
									<FormLabel>PAG-IBIG (₱)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="0.00"
											step="0.01"
											value={field.value || ""}
											onChange={(e) => {
												const value = Number.parseFloat(e.target.value);
												field.onChange(
													e.target.value && !Number.isNaN(value) ? value : null,
												);
											}}
										/>
									</FormControl>
									<FormDescription>
										PAG-IBIG deduction amount (optional)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="tax"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tax (₱)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="0.00"
											step="0.01"
											value={field.value || ""}
											onChange={(e) => {
												const value = Number.parseFloat(e.target.value);
												field.onChange(
													e.target.value && !Number.isNaN(value) ? value : null,
												);
											}}
										/>
									</FormControl>
									<FormDescription>
										Tax deduction amount (optional)
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
