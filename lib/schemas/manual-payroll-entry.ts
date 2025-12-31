import { z } from "zod";

export const manualPayrollEntrySchema = z.object({
	userId: z.string().min(1, "Please select a user"),
	clockInTime: z.string().min(1, "Clock in time is required"),
	clockOutTime: z.string().optional(),
	clockInLatitude: z.number().optional(),
	clockInLongitude: z.number().optional(),
	clockOutLatitude: z.number().optional(),
	clockOutLongitude: z.number().optional(),
});

export type ManualPayrollEntryFormData = z.infer<
	typeof manualPayrollEntrySchema
>;
