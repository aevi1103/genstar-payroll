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
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="working_day_hours_per_week"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Working Hours Per Week <span className="text-red-500">*</span>
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
							<FormDescription>
								Standard working hours per week for employees
							</FormDescription>
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
								Regular OT Rate Multiplier{" "}
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
							<FormDescription>
								Overtime rate multiplier for regular overtime (e.g., 1.25 = 125%
								of regular rate)
							</FormDescription>
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
								Weekend OT Rate Multiplier{" "}
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
							<FormDescription>
								Overtime rate multiplier for weekend work (e.g., 1.3 = 130% of
								regular rate)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="late_grace_period_minutes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Late Grace Period (Minutes){" "}
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
								Grace period in minutes before late deduction applies
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
								Late Deduction (Minutes) <span className="text-red-500">*</span>
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
							<FormDescription>
								Minutes to deduct for being late (after grace period)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="break_hours"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Break Hours <span className="text-red-500">*</span>
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
							<FormDescription>
								Daily break hours to deduct from total hours
							</FormDescription>
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
								Apply Break Deduction After (Hours){" "}
								<span className="text-red-500">*</span>
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
							<FormDescription>
								Only apply break deduction if worked hours exceed this threshold
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Saving..." : "Save Settings"}
				</Button>
			</form>
		</Form>
	);
};
