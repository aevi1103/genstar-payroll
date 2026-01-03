import { prisma } from "@/prisma/client";
import type { Session } from "@supabase/supabase-js";

export const getUserWeeklyPayroll = async ({
	userId,
	weekStart,
	weekEnd,
	session,
}: {
	userId: string;
	weekStart: Date;
	weekEnd: Date;
	session: Session;
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
				created_by: session.user.email || "system",
			},
		});

		return newRecord;
	}

	return record;
};
