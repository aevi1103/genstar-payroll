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
	const weekStart = now.startOf("week").add(1, "day").startOf("day").toDate();
	const weekEnd = now.endOf("week").startOf("day").toDate();

	console.log("clock in date:", today);
	console.log("now:", now.toDate());

	const record = await prisma.payroll.findFirst({
		where: {
			user_id: session.user.id,
			clock_in_date: today,
		},
	});

	if (record?.clock_in_date && record.clock_out_date) {
		console.log("User has already clocked out for today.");
		console.log("today:", {
			now,
			today,
		});
		redirect(
			`/payroll?error=${encodeURIComponent(
				"You have already clocked out for today",
			)}`,
		);
	}

	if (record?.clock_in_date && !record.clock_out_date) {
		// Prevent clocking out within 1 minute of clocking in
		const clockInTime = dayjs(record.clock_in_time);
		const timeDiffInMinutes = now.diff(clockInTime, "minute");

		if (timeDiffInMinutes < 1) {
			redirect(
				`/payroll?error=${encodeURIComponent(
					"Please wait at least 1 minute after clocking in before clocking out",
				)}`,
			);
		}

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
			modified_at: new Date(),
			week_start: weekStart,
			week_end: weekEnd,
		},
	});

	redirect("/payroll?message=Clocked in successfully");
}
