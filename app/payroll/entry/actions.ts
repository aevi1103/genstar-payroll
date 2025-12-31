"use server";

import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

// Server action that toggles a user's clock-in/clock-out state for today.
export async function clockInOut(latitude?: number, longitude?: number) {
	const { session, role } = await getSessionWithRole();

	if (!session || !role) {
		redirect("/auth/login");
	}

	const gpsLocation =
		latitude && longitude
			? `${latitude.toFixed(6)},${longitude.toFixed(6)}`
			: null;

	const now = dayjs();
	const today = now.startOf("day").toDate();
	today.setUTCHours(0, 0, 0, 0);

	const weekStart = now.startOf("week").add(1, "day").startOf("day").toDate();
	const weekEnd = now.endOf("week").startOf("day").toDate();

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
				gps_location_clock_out: gpsLocation,
				modified_at: new Date(),
				modified_by: session.user.email || "system",
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
			gps_location: gpsLocation,
			created_by: session.user.email || "system",
		},
	});

	redirect("/payroll?message=Clocked in successfully");
}
