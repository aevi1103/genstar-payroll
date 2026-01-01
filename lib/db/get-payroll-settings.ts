import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

export const getPayrollSettings = async () => {
	return await prisma.payroll_settings.findFirst();
};

export type PayrollSettings = Prisma.PromiseReturnType<
	typeof getPayrollSettings
>;
