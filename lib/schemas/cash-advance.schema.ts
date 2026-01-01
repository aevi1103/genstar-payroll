import { z } from "zod";

export const cashAdvanceSchema = z.object({
	user_id: z.string().uuid({
		message: "Please select a valid employee",
	}),
	cash_advance: z
		.number({
			message: "Cash advance must be a number",
		})
		.positive({
			message: "Cash advance must be greater than 0",
		})
		.max(100000, {
			message: "Cash advance cannot exceed ₱100,000",
		}),
	is_paid: z.boolean().default(false).optional(),
});

export type CashAdvanceFormData = z.infer<typeof cashAdvanceSchema>;
