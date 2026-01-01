"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { recordCashAdvancePayment } from "@/app/payroll/deductions/cash-advances/actions";
import type { CashAdvanceRecord } from "@/lib/db/get-cash-advances";

type PaymentDialogProps = {
	cashAdvance: CashAdvanceRecord | undefined;
	children: React.ReactNode;
};

export const PaymentDialog = ({
	cashAdvance,
	children,
}: PaymentDialogProps) => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const totalAmount = Number(cashAdvance?.cash_advance || 0);
	const paidAmount = Number(cashAdvance?.paid_amount || 0);
	const remainingBalance = totalAmount - paidAmount;

	const paymentSchema = z.object({
		amount: z
			.number({ message: "Payment amount is required" })
			.positive("Payment amount must be greater than 0")
			.max(
				remainingBalance,
				`Payment amount cannot exceed remaining balance of ₱${remainingBalance.toLocaleString(
					"en-PH",
					{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					},
				)}`,
			),
	});

	type PaymentFormData = z.infer<typeof paymentSchema>;

	const form = useForm<PaymentFormData>({
		resolver: standardSchemaResolver(paymentSchema),
		defaultValues: {
			amount: remainingBalance,
		},
	});

	// Reset form with remaining balance when dialog opens
	useEffect(() => {
		if (open) {
			form.reset({
				amount: remainingBalance,
			});
		}
	}, [open, remainingBalance, form]);

	const handleSubmit = async (data: PaymentFormData) => {
		setIsLoading(true);

		try {
			const result = await recordCashAdvancePayment(
				cashAdvance?.id.toString() || "",
				data.amount,
			);

			if (result.success) {
				const isPaid = paidAmount + data.amount >= totalAmount;
				toast.success(
					isPaid
						? "Cash advance marked as paid"
						: "Payment recorded successfully",
				);
				setOpen(false);
				form.reset();
			} else {
				toast.error(result.error || "Failed to record payment");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePayFull = () => {
		form.setValue("amount", remainingBalance);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Record Payment</DialogTitle>
					<DialogDescription>
						Record a partial or full payment for {cashAdvance?.name}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-muted-foreground">Total Amount</p>
							<p className="text-lg font-semibold">
								₱
								{totalAmount.toLocaleString("en-PH", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Already Paid</p>
							<p className="text-lg font-semibold">
								₱
								{paidAmount.toLocaleString("en-PH", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
					</div>

					<div className="rounded-lg bg-muted p-4">
						<p className="text-sm text-muted-foreground">Remaining Balance</p>
						<p className="text-2xl font-bold">
							₱
							{remainingBalance.toLocaleString("en-PH", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Payment Amount</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="Enter payment amount"
												{...field}
												onChange={(e) =>
													field.onChange(Number.parseFloat(e.target.value) || 0)
												}
											/>
										</FormControl>
										<FormDescription>
											Enter the amount to be paid. Cannot exceed remaining
											balance.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={handlePayFull}
									disabled={isLoading}
								>
									Pay Full Amount
								</Button>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Recording...
										</>
									) : (
										"Record Payment"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};
