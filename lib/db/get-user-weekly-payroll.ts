import { prisma } from "@/prisma/client";

export const getUserWeeklyPayroll = async ({
	userId,
	weekStart,
	weekEnd,
}: {
	userId: string;
	weekStart: Date;
	weekEnd: Date;
}) => {
	const record = await prisma.user_weekly_payroll.findFirst({
		where: {
			user_id: userId,
			week_start: weekStart,
			week_end: weekEnd,
		},
	});

	if (!record) {
		const newRecord = await prisma.user_weekly_payroll.create({
			data: {
				user_id: userId,
				week_start: weekStart,
				week_end: weekEnd,
			},
		});

		return newRecord;
	}

	return record;
};
