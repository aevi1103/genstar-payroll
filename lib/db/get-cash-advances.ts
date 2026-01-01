import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

export async function getCashAdvances() {
	const cashAdvancesRaw = await prisma.cash_advances.findMany({
		select: {
			id: true,
			cash_advance: true,
			is_paid: true,
			paid_amount: true,
			created_at: true,
			modified_at: true,
			created_by: true,
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
		orderBy: {
			created_at: "desc",
		},
	});

	return cashAdvancesRaw.map((record) => {
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

export type CashAdvances = Prisma.PromiseReturnType<typeof getCashAdvances>;
export type CashAdvanceRecord = CashAdvances[number];
