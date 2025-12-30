"use client";

import type { PayrollSetting } from "@/app/payroll/settings/payroll/actions";
import { upsertPayrollSettings } from "@/app/payroll/settings/payroll/actions";
import {
	payrollSettingsSchema,
	type PayrollSettingsFormData,
} from "@/lib/schemas/payroll-settings";
import { zodResolver } from "@hookform/resolvers/zod";
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
		resolver: zodResolver(payrollSettingsSchema),
		mode: "onChange",
		defaultValues: {
			working_day_hours_per_week:
				initialData?.working_day_hours_per_week || undefined,
			regular_ot_rate_percent:
				initialData?.regular_ot_rate_percent || undefined,
			weekend_ot_rate: initialData?.weekend_ot_rate || undefined,
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

				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Saving..." : "Save Settings"}
				</Button>
			</form>
		</Form>
	);
};
