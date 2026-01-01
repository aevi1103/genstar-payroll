import { z } from "zod";

export const payrollDeductionsSchema = z.object({
	user_id: z
		.string()
		.min(1, {
			message: "Please select an employee",
		})
		.uuid({
			message: "Please select a valid employee",
		}),
	year: z
		.number()
		.int({
			message: "Year must be an integer",
		})
		.min(2000, {
			message: "Year must be 2000 or later",
		})
		.max(2100, {
			message: "Year cannot exceed 2100",
		}),
	sss: z
		.number()
		.nonnegative({
			message: "SSS must be 0 or greater",
		})
		.max(100000, {
			message: "SSS cannot exceed ₱100,000",
		}),
	pag_ibig: z
		.number()
		.nonnegative({
			message: "PAG-IBIG must be 0 or greater",
		})
		.max(100000, {
			message: "PAG-IBIG cannot exceed ₱100,000",
		})
		.optional()
		.nullable(),
	tax: z
		.number()
		.nonnegative({
			message: "Tax must be 0 or greater",
		})
		.max(100000, {
			message: "Tax cannot exceed ₱100,000",
		})
		.optional()
		.nullable(),
});

export type PayrollDeductionsFormData = z.infer<typeof payrollDeductionsSchema>;
