"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";
import {
	companyInfoSchema,
	type CompanyInfoFormData,
} from "@/lib/schemas/company-info";

export const getCompanyInfo = async () => {
	const { role } = await getSessionWithRole();

	if (role.toLowerCase() !== "admin") {
		return {
			success: false,
			error: "Unauthorized",
		} as const;
	}

	const info = await prisma.company_info.findFirst({
		include: {
			company_machines: {
				orderBy: { created_at: "desc" },
			},
			company_other_services: {
				orderBy: { created_at: "desc" },
			},
			company_suppliers: {
				orderBy: { created_at: "desc" },
			},
			company_team: {
				orderBy: { created_at: "desc" },
			},
			company_what_we_print: {
				orderBy: { created_at: "desc" },
			},
		},
	});

	return {
		success: true,
		data: info,
	} as const;
};

export const upsertCompanyInfo = async (data: CompanyInfoFormData) => {
	const { role } = await getSessionWithRole();

	if (role.toLowerCase() !== "admin") {
		return {
			success: false,
			error: "Unauthorized",
		} as const;
	}

	const validationResult = companyInfoSchema.safeParse(data);
	if (!validationResult.success) {
		return {
			success: false,
			error: "Invalid input",
			errors: validationResult.error.flatten(),
		} as const;
	}

	try {
		const existing = await prisma.company_info.findFirst();

		const {
			company_machines = [],
			company_other_services = [],
			company_suppliers = [],
			company_team = [],
			company_what_we_print = [],
			...companyData
		} = validationResult.data;

		console.log(
			"Server received - Other services:",
			company_other_services.length,
			company_other_services,
		);
		console.log(
			"Server received - What we print:",
			company_what_we_print.length,
			company_what_we_print,
		);
		console.log(
			"Server received - Machines:",
			company_machines.length,
			company_machines,
		);
		console.log("Server received - Team:", company_team.length, company_team);

		// Serialize BigInt fields to strings for comparison
		const serializeBigInt = (obj: unknown) =>
			JSON.parse(
				JSON.stringify(obj, (_, value) =>
					typeof value === "bigint" ? value.toString() : value,
				),
			);

		const record = existing
			? await prisma.company_info.update({
					where: { id: existing.id },
					data: {
						...companyData,
						// Update related machines
						company_machines: {
							deleteMany: {},
							create: company_machines.map((m) => ({
								machine_description: m.machine_description,
							})),
						},
						// Update related other services
						company_other_services: {
							deleteMany: {},
							create: company_other_services.map((s) => ({
								service: s.service,
							})),
						},
						// Note: company_suppliers handled separately due to schema issue
						// Update team
						company_team: {
							deleteMany: {},
							create: company_team.map((t) => ({
								position: t.position,
								description: t.description,
								count: t.count,
							})),
						},
						// Update what we print
						company_what_we_print: {
							deleteMany: {},
							create: company_what_we_print.map((p) => ({
								service: p.service,
							})),
						},
						company_suppliers: {
							deleteMany: {},
							create: company_suppliers.map((s) => ({
								supplier: s.supplier,
							})),
						},
					},
					include: {
						company_machines: true,
						company_other_services: true,
						company_suppliers: true,
						company_team: true,
						company_what_we_print: true,
					},
				})
			: await prisma.company_info.create({
					data: {
						...companyData,
						company_machines: {
							create: company_machines.map((m) => ({
								machine_description: m.machine_description,
							})),
						},
						company_other_services: {
							create: company_other_services.map((s) => ({
								service: s.service,
							})),
						},
						// Note: company_suppliers handled separately due to schema issue
						company_team: {
							create: company_team.map((t) => ({
								position: t.position,
								description: t.description,
								count: t.count,
							})),
						},
						company_what_we_print: {
							create: company_what_we_print.map((p) => ({
								service: p.service,
							})),
						},
						company_suppliers: {
							create: company_suppliers.map((s) => ({
								supplier: s.supplier,
							})),
						},
					},
					include: {
						company_machines: true,
						company_other_services: true,
						company_suppliers: true,
						company_team: true,
						company_what_we_print: true,
					},
				});

		// Refetch to include updated supplier
		const finalRecord = await prisma.company_info.findUnique({
			where: { id: record.id },
			include: {
				company_machines: true,
				company_other_services: true,
				company_suppliers: true,
				company_team: true,
				company_what_we_print: true,
			},
		});

		// Revalidate both the path and the cache tag
		revalidatePath("/payroll/settings/company-info");
		revalidateTag("company-info", "default");

		return {
			success: true,
			data: serializeBigInt(finalRecord),
		} as const;
	} catch (error) {
		console.error("Error upserting company info:", error);
		return {
			success: false,
			error: "Failed to save company info",
		} as const;
	}
};

export type CompanyInfo = Prisma.PromiseReturnType<
	typeof getCompanyInfo
>["data"];
export type CompanyInfoRecord = NonNullable<CompanyInfo>;
