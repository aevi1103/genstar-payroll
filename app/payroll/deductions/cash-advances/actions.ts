"use server";

import { revalidatePath } from "next/cache";
import {
	cashAdvanceSchema,
	type CashAdvanceFormData,
} from "@/lib/schemas/cash-advance.schema";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";

type ActionResult = {
	success: boolean;
	error?: string;
};

/**
 * Create a new cash advance record
 */
export async function createCashAdvance(
	data: CashAdvanceFormData,
): Promise<ActionResult> {
	try {
		const { session, role } = await getSessionWithRole();

		// Only admins can create cash advances
		if (role !== "admin") {
			return { success: false, error: "Unauthorized - admin only" };
		}

		// Validate input data
		const validatedData = cashAdvanceSchema.parse(data);

		// Get user's full name for created_by field
		const creatorName =
			session.user.user_metadata?.full_name || session.user.email || "Admin";

		// Create cash advance record
		await prisma.cash_advances.create({
			data: {
				user_id: validatedData.user_id,
				cash_advance: validatedData.cash_advance,
				is_paid: validatedData.is_paid,
				created_by: creatorName,
			},
		});

		revalidatePath("/payroll/cash-advances");

		return { success: true };
	} catch (error) {
		console.error("Error creating cash advance:", error);

		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Failed to create cash advance" };
	}
}

/**
 * Record a payment for cash advance (partial or full)
 */
export async function recordCashAdvancePayment(
	id: string,
	paymentAmount: number,
): Promise<ActionResult> {
	try {
		const { session, role } = await getSessionWithRole();

		// Only admins can update cash advances
		if (role !== "admin") {
			return { success: false, error: "Unauthorized - admin only" };
		}

		// Validate payment amount
		if (paymentAmount <= 0) {
			return { success: false, error: "Payment amount must be greater than 0" };
		}

		// Get the current cash advance record
		const cashAdvance = await prisma.cash_advances.findUnique({
			where: { id: BigInt(id) },
		});

		if (!cashAdvance) {
			return { success: false, error: "Cash advance not found" };
		}

		// Calculate new paid amount
		const currentPaidAmount = cashAdvance.paid_amount || 0;
		const newPaidAmount = currentPaidAmount + paymentAmount;

		// Check if payment exceeds total cash advance
		if (newPaidAmount > cashAdvance.cash_advance) {
			return {
				success: false,
				error: "Payment amount exceeds remaining balance",
			};
		}

		// Get user's full name for modified_by field
		const modifierName =
			session.user.user_metadata?.full_name || session.user.email || "Admin";

		// Determine if fully paid
		const isPaid = newPaidAmount >= cashAdvance.cash_advance;

		// Update cash advance
		await prisma.cash_advances.update({
			where: { id: BigInt(id) },
			data: {
				paid_amount: newPaidAmount,
				is_paid: isPaid,
				modified_at: new Date(),
				modified_by: modifierName,
			},
		});

		revalidatePath("/payroll/cash-advances");

		return { success: true };
	} catch (error) {
		console.error("Error recording payment:", error);

		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Failed to record payment" };
	}
}

/**
 * Revert a cash advance to unpaid status
 */
export async function revertCashAdvanceToUnpaid(
	id: string,
): Promise<ActionResult> {
	try {
		const { session, role } = await getSessionWithRole();

		// Only admins can update cash advances
		if (role !== "admin") {
			return { success: false, error: "Unauthorized - admin only" };
		}

		// Get user's full name for modified_by field
		const modifierName =
			session.user.user_metadata?.full_name || session.user.email || "Admin";

		// Revert cash advance to unpaid
		await prisma.cash_advances.update({
			where: { id: BigInt(id) },
			data: {
				is_paid: false,
				paid_amount: 0,
				modified_at: new Date(),
				modified_by: modifierName,
			},
		});

		revalidatePath("/payroll/cash-advances");

		return { success: true };
	} catch (error) {
		console.error("Error reverting cash advance:", error);

		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Failed to revert cash advance" };
	}
}

/**
 * Delete a cash advance record
 */
export async function deleteCashAdvance(id: string): Promise<ActionResult> {
	try {
		const { role } = await getSessionWithRole();

		// Only admins can delete cash advances
		if (role !== "admin") {
			return { success: false, error: "Unauthorized - admin only" };
		}

		// Delete cash advance
		await prisma.cash_advances.delete({
			where: { id: BigInt(id) },
		});

		revalidatePath("/payroll/cash-advances");

		return { success: true };
	} catch (error) {
		console.error("Error deleting cash advance:", error);

		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Failed to delete cash advance" };
	}
}
