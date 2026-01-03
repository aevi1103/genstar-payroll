"use server";

import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { getWeekDateRange } from "@/lib/get-week-date-range";
import { getUserWeeklyPayroll } from "@/lib/db/get-user-weekly-payroll";
// import { adjustClockInTime } from "@/lib/adjust-clock-in-time";
import { isActiveEmployee } from "@/lib/db/is-active-employee";

dayjs.extend(weekOfYear);

// Server action that toggles a user's clock-in/clock-out state for today.
export async function clockInOut(latitude?: number, longitude?: number) {
	const { session } = await getSessionWithRole();

	if (!session) {
		redirect("/auth/login");
	}

	const isActive = await isActiveEmployee(session.user.id);
	if (!isActive) {
		redirect(`/?error=${encodeURIComponent("Forbidden - inactive employee")}`);
	}

	const gpsLocation =
		latitude && longitude
			? `${latitude.toFixed(6)},${longitude.toFixed(6)}`
			: null;

	const now = dayjs();
	// adjust clock in time if using QR code clock in
	// const { time: clockInTime, message } = await adjustClockInTime(now);
	const clockInTime = now;
	const today = clockInTime.startOf("day").toDate();
	today.setUTCHours(0, 0, 0, 0);

	const { weekStart, weekEnd } = getWeekDateRange(clockInTime);

	const userWeeklyPayroll = await getUserWeeklyPayroll({
		userId: session.user.id,
		weekStart,
		weekEnd,
		session,
	});

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
		const recordClockInTime = dayjs(record.clock_in_time);
		const timeDiffInMinutes = now.diff(recordClockInTime, "minute");

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

		redirect(
			`/payroll?message=${encodeURIComponent("Clocked out successfully")}&time=${now.toISOString()}`,
		);
	}

	await prisma.payroll.create({
		data: {
			user_id: session.user.id,
			original_clock_in_time: now.toDate(),
			clock_in_time: clockInTime.toDate(),
			clock_in_date: today,
			created_at: now.toDate(),
			modified_at: new Date(),
			weekly_payroll_id: userWeeklyPayroll.id,
			gps_location: gpsLocation,
			created_by: session.user.email || "system",
		},
	});

	redirect(
		`/payroll?message=${encodeURIComponent("Clocked in successfully")}&time=${now.toISOString()}`,
	);
}
