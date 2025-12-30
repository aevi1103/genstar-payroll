"use server";

import { revalidatePath } from "next/cache";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";
import {
	payrollSettingsSchema,
	type PayrollSettingsFormData,
} from "@/lib/schemas/payroll-settings";

export const getPayrollSettings = async () => {
	const { role } = await getSessionWithRole();

	if (role.toLowerCase() !== "admin") {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	const settings = await prisma.payroll_settings.findFirst();

	return {
		success: true,
		data: settings,
	};
};

export const upsertPayrollSettings = async (data: PayrollSettingsFormData) => {
	const { role, user } = await getSessionWithRole();

	if (role.toLowerCase() !== "admin") {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	// Validate input
	const validationResult = payrollSettingsSchema.safeParse(data);
	if (!validationResult.success) {
		return {
			success: false,
			error: "Invalid input",
			errors: validationResult.error.flatten(),
		};
	}

	try {
		// Check if settings already exist
		const existing = await prisma.payroll_settings.findFirst();

		let settings: Prisma.payroll_settingsCreateInput;
		if (existing) {
			// Update existing
			settings = await prisma.payroll_settings.update({
				where: { id: existing.id },
				data: {
					...validationResult.data,
					modified_at: new Date(),
					modified_by: user?.email || "system",
				},
			});
		} else {
			// Create new
			settings = await prisma.payroll_settings.create({
				data: {
					...validationResult.data,
					created_by: user?.email || "system",
				},
			});
		}

		// Invalidate cache for the settings page
		revalidatePath("/payroll/settings/payroll");

		return {
			success: true,
			data: settings,
		};
	} catch (error) {
		console.error("Error upserting payroll settings:", error);
		return {
			success: false,
			error: "Failed to save settings",
		};
	}
};

export type PayrollSettings = Prisma.PromiseReturnType<
	typeof getPayrollSettings
>["data"];

export type PayrollSetting = NonNullable<PayrollSettings>;
