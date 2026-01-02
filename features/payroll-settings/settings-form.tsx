"use client";

import type { PayrollSetting } from "@/app/payroll/settings/payroll/actions";
import { upsertPayrollSettings } from "@/app/payroll/settings/payroll/actions";
import {
	payrollSettingsSchema,
	type PayrollSettingsFormData,
} from "@/lib/schemas/payroll-settings";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";

export const SettingsForm = ({
	initialData,
}: { initialData: PayrollSetting | null }) => {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<PayrollSettingsFormData>({
		resolver: standardSchemaResolver(payrollSettingsSchema),
		mode: "onChange",
		defaultValues: {
			working_day_hours_per_week:
				initialData?.working_day_hours_per_week || undefined,
			regular_ot_rate_percent:
				initialData?.regular_ot_rate_percent || undefined,
			weekend_ot_rate: initialData?.weekend_ot_rate || undefined,
			late_grace_period_minutes: initialData?.late_grace_period_minutes ?? 5,
			late_deduction_minutes: initialData?.late_deduction_minutes ?? 30,
			break_hours: initialData?.break_hours ?? 1,
			apply_break_deduction_after_hour:
				initialData?.apply_break_deduction_after_hour ?? 4,
			cash_advance_weekly_deduction_percent:
				initialData?.cash_advance_weekly_deduction_percent ?? 10,
		},
	});

	const onSubmit = async (data: PayrollSettingsFormData) => {
		setIsLoading(true);
		try {
			const result = await upsertPayrollSettings(data);

			if (result.success) {
				toast.success("Payroll settings saved successfully");
				form.reset(data);
			} else {
				toast.error(result.error || "Failed to save settings");
				if ("errors" in result) {
					console.error("Validation errors:", result.errors);
				}
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Working Hours & Overtime Section */}
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold">Working Hours & Overtime</h3>
						<p className="text-sm text-muted-foreground">
							Configure standard working hours and overtime rate multipliers
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						<FormField
							control={form.control}
							name="working_day_hours_per_week"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Working Hours Per Week{" "}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="48"
											{...field}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? Number.parseInt(e.target.value, 10)
														: undefined,
												)
											}
										/>
									</FormControl>
									<FormDescription>Standard weekly hours</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="regular_ot_rate_percent"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Regular OT Multiplier{" "}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											placeholder="1.25"
											{...field}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? Number.parseFloat(e.target.value)
														: undefined,
												)
											}
										/>
									</FormControl>
									<FormDescription>e.g., 1.25 = 125%</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="weekend_ot_rate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Weekend OT Multiplier{" "}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											placeholder="1.3"
											{...field}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? Number.parseFloat(e.target.value)
														: undefined,
												)
											}
										/>
									</FormControl>
									<FormDescription>e.g., 1.3 = 130%</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Separator />

				{/* Late Penalties Section */}
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold">
							Late Penalties & Grace Period
						</h3>
						<p className="text-sm text-muted-foreground">
							Configure late arrival penalties and grace period settings
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<FormField
							control={form.control}
							name="late_grace_period_minutes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Grace Period (Minutes){" "}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="5"
											{...field}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? Number.parseInt(e.target.value, 10)
														: undefined,
												)
											}
										/>
									</FormControl>
									<FormDescription>
										Minutes before deduction applies
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="late_deduction_minutes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Deduction Duration (Minutes){" "}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="30"
											{...field}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? Number.parseInt(e.target.value, 10)
														: undefined,
												)
											}
										/>
									</FormControl>
									<FormDescription>Minutes to deduct when late</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Separator />

				{/* Break Management Section */}
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold">Break Management</h3>
						<p className="text-sm text-muted-foreground">
							Configure daily break deduction rules
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<FormField
							control={form.control}
							name="break_hours"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Daily Break Hours <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="1"
											{...field}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? Number.parseInt(e.target.value, 10)
														: undefined,
												)
											}
										/>
									</FormControl>
									<FormDescription>Hours to deduct daily</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="apply_break_deduction_after_hour"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Apply After (Hours) <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="4"
											{...field}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? Number.parseInt(e.target.value, 10)
														: undefined,
												)
											}
										/>
									</FormControl>
									<FormDescription>Minimum hours threshold</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Separator />

				{/* Cash Advance Section */}
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold">Cash Advance Settings</h3>
						<p className="text-sm text-muted-foreground">
							Configure cash advance deduction rules
						</p>
					</div>

					<FormField
						control={form.control}
						name="cash_advance_weekly_deduction_percent"
						render={({ field }) => (
							<FormItem className="max-w-xs">
								<FormLabel>Weekly Deduction (%)</FormLabel>
								<FormControl>
									<Input
										type="text"
										inputMode="numeric"
										placeholder="10"
										{...field}
										value={field.value ?? ""}
										onChange={(e) => {
											const value = e.target.value.trim();
											if (value === "") {
												field.onChange(undefined);
											} else {
												const parsed = Number.parseFloat(value);
												if (!Number.isNaN(parsed)) {
													field.onChange(parsed);
												}
											}
										}}
									/>
								</FormControl>
								<FormDescription>
									Percentage of weekly payroll to deduct (0-100%)
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Submit Button */}
				<div className="pt-4">
					<Button type="submit" disabled={isLoading} size="lg">
						{isLoading ? "Saving..." : "Save Settings"}
					</Button>
				</div>
			</form>
		</Form>
	);
};
