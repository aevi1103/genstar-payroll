"use server";

import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

// Server action that toggles a user's clock-in/clock-out state for today.
export async function clockInOut() {
	const { session, role } = await getSessionWithRole();

	if (!session || !role) {
		redirect("/auth/login");
	}

	const now = dayjs();
	const today = now.startOf("day").toDate();

	const record = await prisma.payroll.findFirst({
		where: {
			user_id: session.user.id,
			clock_in_date: today,
		},
	});

	if (record?.clock_in_date && record.clock_out_date) {
		redirect(
			`/payroll?error=${encodeURIComponent(
				"You have already clocked out for today",
			)}`,
		);
	}

	if (record?.clock_in_date && !record.clock_out_date) {
		await prisma.payroll.update({
			where: {
				id: record.id,
			},
			data: {
				clock_out_time: now.toDate(),
				clock_out_date: today,
			},
		});

		redirect("/payroll?message=Clocked out successfully");
	}

	await prisma.payroll.create({
		data: {
			user_id: session.user.id,
			clock_in_time: now.toDate(),
			clock_in_date: today,
			created_at: now.toDate(),
			payroll_week: now.week(),
			payroll_year: now.year(),
			modified_at: new Date(),
		},
	});

	redirect("/payroll?message=Clocked in successfully");
}
