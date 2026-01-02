import { z } from "zod";

export const payrollSettingsSchema = z.object({
	working_day_hours_per_week: z
		.number()
		.int("Working hours must be a whole number")
		.positive("Working hours must be greater than 0"),
	regular_ot_rate_percent: z
		.number()
		.positive("Regular OT rate must be greater than 0"),
	weekend_ot_rate: z
		.number()
		.positive("Weekend OT rate must be greater than 0"),
	late_grace_period_minutes: z
		.number()
		.int("Grace period must be a whole number")
		.nonnegative("Grace period cannot be negative"),
	late_deduction_minutes: z
		.number()
		.int("Deduction time must be a whole number")
		.positive("Deduction time must be greater than 0"),
	break_hours: z
		.number()
		.int("Break hours must be a whole number")
		.nonnegative("Break hours cannot be negative"),
	apply_break_deduction_after_hour: z
		.number()
		.int("Hours threshold must be a whole number")
		.positive("Hours threshold must be greater than 0"),
	cash_advance_weekly_deduction_percent: z
		.number()
		.min(0, "Deduction percentage cannot be negative")
		.max(100, "Deduction percentage cannot exceed 100")
		.optional(),
});

export type PayrollSettingsFormData = z.infer<typeof payrollSettingsSchema>;
