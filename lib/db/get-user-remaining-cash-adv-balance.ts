import { prisma } from "@/prisma/client";

export const getUserRemainingCashAdvBalance = async (userId: string) => {
	const record = await prisma.cash_advances.aggregate({
		where: {
			user_id: userId,
			is_paid: false,
		},
		_sum: {
			cash_advance: true,
			paid_amount: true,
		},
	});

	const totalCashAdvance = record._sum.cash_advance || 0;
	const totalPaidAmount = record._sum.paid_amount || 0;
	const remainingBalance = totalCashAdvance - totalPaidAmount;

	return remainingBalance;
};
