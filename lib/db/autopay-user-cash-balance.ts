import type { Prisma } from "@prisma/client";

export const autopayUserCashBalance = async (
	userId: string,
	amount: number,
	tx: Prisma.TransactionClient,
) => {
	const cashBalance = await tx.cash_advances.findMany({
		where: {
			user_id: userId,
			is_paid: false,
		},
		orderBy: {
			created_at: "asc",
		},
	});

	let tempAmount = amount;
	for (const cashAdv of cashBalance) {
		const currentPaid = cashAdv.paid_amount || 0;
		const remainingAmount = cashAdv.cash_advance - currentPaid;

		if (tempAmount <= 0) {
			break;
		}

		if (remainingAmount <= 0) {
			continue;
		}

		const payment = Math.min(remainingAmount, tempAmount);
		const newPaidAmt = currentPaid + payment;
		const newBalance = cashAdv.cash_advance - newPaidAmt;

		await tx.cash_advances.update({
			where: {
				id: cashAdv.id,
			},
			data: {
				paid_amount: newPaidAmt,
				is_paid: newPaidAmt >= cashAdv.cash_advance,
				modified_at: new Date(),
			},
		});

		await tx.cash_advance_payments_log.create({
			data: {
				cash_advance_id: cashAdv.id,
				current_balance: newBalance,
				payment: payment,
				created_at: new Date(),
				created_by: "system-autopay",
			},
		});

		tempAmount -= payment;
	}
};
