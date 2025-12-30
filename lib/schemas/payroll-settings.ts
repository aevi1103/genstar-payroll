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
});

export type PayrollSettingsFormData = z.infer<typeof payrollSettingsSchema>;
