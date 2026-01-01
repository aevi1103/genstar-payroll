import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

export async function getPayrollDeductions() {
	const deductionsRaw = await prisma.payroll_deductions.findMany({
		select: {
			id: true,
			user_id: true,
			sss: true,
			pag_ibig: true,
			tax: true,
			year: true,
			created_at: true,
			modified_at: true,
			created_by: true,
			modified_by: true,
			users: {
				select: {
					email: true,
					user_profiles: {
						select: {
							first_name: true,
							last_name: true,
							middle_name: true,
						},
					},
				},
			},
		},
		orderBy: [{ year: "desc" }, { created_at: "desc" }],
	});

	return deductionsRaw.map((record) => {
		const firstName = record.users.user_profiles[0]?.first_name || "";
		const lastName = record.users.user_profiles[0]?.last_name || "";

		const name = firstName ? `${firstName} ${lastName}` : record.users.email;

		return {
			...record,
			first_name: firstName,
			last_name: lastName,
			name: name,
			user_profile: record.users.user_profiles[0],
		};
	});
}

export type PayrollDeductions = Prisma.PromiseReturnType<
	typeof getPayrollDeductions
>;
export type PayrollDeductionRecord = PayrollDeductions[number];
