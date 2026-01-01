import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

export const getPayrollSettings = async () => {
	try {
		const data = await prisma.payroll_settings.findFirst();
		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: "Failed to fetch payroll settings",
		};
	}
};

export type PayrollSettingsResponse = Prisma.PromiseReturnType<
	typeof getPayrollSettings
>;
