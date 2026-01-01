"use server";

import { revalidatePath } from "next/cache";
import {
	payrollDeductionsSchema,
	type PayrollDeductionsFormData,
} from "@/lib/schemas/payroll-deductions.schema";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";

type ActionResult = {
	success: boolean;
	error?: string;
};

/**
 * Create a new payroll deduction record
 */
export async function createPayrollDeduction(
	data: PayrollDeductionsFormData,
): Promise<ActionResult> {
	try {
		const { session, role } = await getSessionWithRole();

		// Only admins can create payroll deductions
		if (role !== "admin") {
			return { success: false, error: "Unauthorized - admin only" };
		}

		// Validate input data
		const validatedData = payrollDeductionsSchema.parse(data);

		// Get user's full name for created_by field
		const creatorName =
			session.user.user_metadata?.full_name || session.user.email || "Admin";

		// Check if a deduction record already exists for this user and year
		const existingDeduction = await prisma.payroll_deductions.findFirst({
			where: {
				user_id: validatedData.user_id,
				year: validatedData.year,
			},
		});

		if (existingDeduction) {
			return {
				success: false,
				error: `A deduction record for year ${validatedData.year} already exists for this employee`,
			};
		}

		// Create payroll deduction record
		await prisma.payroll_deductions.create({
			data: {
				user_id: validatedData.user_id,
				year: validatedData.year,
				sss: validatedData.sss,
				pag_ibig: validatedData.pag_ibig ?? null,
				tax: validatedData.tax ?? null,
				created_by: creatorName,
			},
		});

		revalidatePath("/payroll/deductions/payroll-deductions");

		return { success: true };
	} catch (error) {
		console.error("Error creating payroll deduction:", error);

		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Failed to create payroll deduction" };
	}
}

/**
 * Update an existing payroll deduction record
 */
export async function updatePayrollDeduction(
	id: string,
	data: PayrollDeductionsFormData,
): Promise<ActionResult> {
	try {
		const { session, role } = await getSessionWithRole();

		// Only admins can update payroll deductions
		if (role !== "admin") {
			return { success: false, error: "Unauthorized - admin only" };
		}

		// Validate input data
		const validatedData = payrollDeductionsSchema.parse(data);

		// Get the current deduction record
		const deduction = await prisma.payroll_deductions.findUnique({
			where: { id: BigInt(id) },
		});

		if (!deduction) {
			return { success: false, error: "Payroll deduction not found" };
		}

		// Get user's full name for modified_by field
		const modifierName =
			session.user.user_metadata?.full_name || session.user.email || "Admin";

		// Update deduction record
		await prisma.payroll_deductions.update({
			where: { id: BigInt(id) },
			data: {
				user_id: validatedData.user_id,
				year: validatedData.year,
				sss: validatedData.sss,
				pag_ibig: validatedData.pag_ibig ?? null,
				tax: validatedData.tax ?? null,
				modified_at: new Date(),
				modified_by: modifierName,
			},
		});

		revalidatePath("/payroll/deductions/payroll-deductions");

		return { success: true };
	} catch (error) {
		console.error("Error updating payroll deduction:", error);

		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Failed to update payroll deduction" };
	}
}

/**
 * Delete a payroll deduction record
 */
export async function deletePayrollDeduction(
	id: string,
): Promise<ActionResult> {
	try {
		const { role } = await getSessionWithRole();

		// Only admins can delete payroll deductions
		if (role !== "admin") {
			return { success: false, error: "Unauthorized - admin only" };
		}

		// Check if the deduction exists
		const deduction = await prisma.payroll_deductions.findUnique({
			where: { id: BigInt(id) },
		});

		if (!deduction) {
			return { success: false, error: "Payroll deduction not found" };
		}

		// Delete the deduction record
		await prisma.payroll_deductions.delete({
			where: { id: BigInt(id) },
		});

		revalidatePath("/payroll/deductions/payroll-deductions");

		return { success: true };
	} catch (error) {
		console.error("Error deleting payroll deduction:", error);

		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Failed to delete payroll deduction" };
	}
}
