import { NextResponse } from "next/server";

import { prisma } from "@/prisma/client";
import dayjs from "dayjs";
import { getSessionWithRole } from "@/lib/session";
import { serializeData } from "@/lib/utils";
import { getUserWeeklyPayroll } from "@/lib/db/get-user-weekly-payroll";
import { getWeekDateRange } from "@/lib/get-week-date-range";

export async function POST(request: Request) {
	const { session, role } = await getSessionWithRole();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (role?.toLowerCase() !== "admin") {
		return NextResponse.json(
			{ error: "Forbidden - insufficient permissions" },
			{ status: 403 },
		);
	}

	try {
		const body = (await request.json().catch(() => null)) as {
			userId?: string;
			clockInTime?: string;
			clockOutTime?: string;
			clockInLatitude?: number;
			clockInLongitude?: number;
			clockOutLatitude?: number;
			clockOutLongitude?: number;
		} | null;

		// Validate input
		if (!body || !body.userId || !body.clockInTime) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// no need to adjust clock in time for manual entries
		const clockIn = dayjs(body.clockInTime);
		const clockOut = body.clockOutTime ? dayjs(body.clockOutTime) : null;

		// Validate that clock out is after clock in
		if (clockOut?.isBefore(clockIn)) {
			return NextResponse.json(
				{ error: "Clock out time must be after clock in time" },
				{ status: 400 },
			);
		}

		const date = clockIn.startOf("day").endOf("day").toDate();
		date.setUTCHours(0, 0, 0, 0);

		const clockOutDate = clockOut ? clockOut.startOf("day").toDate() : null;

		if (clockOutDate) {
			clockOutDate.setUTCHours(0, 0, 0, 0);
		}

		const { weekStart, weekEnd } = getWeekDateRange(clockIn);

		const userWeeklyPayroll = await getUserWeeklyPayroll({
			userId: body.userId,
			weekStart,
			weekEnd,
		});

		const gpsLocationClockIn =
			body.clockInLatitude && body.clockInLongitude
				? `${body.clockInLatitude.toFixed(6)},${body.clockInLongitude.toFixed(6)}`
				: null;

		const gpsLocationClockOut =
			body.clockOutLatitude && body.clockOutLongitude
				? `${body.clockOutLatitude.toFixed(6)},${body.clockOutLongitude.toFixed(6)}`
				: null;

		const existingRecord = await prisma.payroll.findFirst({
			where: {
				user_id: body.userId,
				clock_in_date: date,
			},
		});

		if (existingRecord) {
			const res = await prisma.payroll.update({
				where: {
					id: existingRecord.id,
				},
				data: {
					clock_in_time: clockIn.toDate(),
					clock_in_date: date,
					clock_out_time: body.clockOutTime ? clockOut?.toDate() : undefined,
					clock_out_date: body.clockOutTime ? clockOutDate : undefined,
					gps_location: gpsLocationClockIn,
					gps_location_clock_out: body.clockOutTime
						? gpsLocationClockOut
						: undefined,
					modified_at: new Date(),
					modified_by: session.user.email || "system",
				},
			});

			return NextResponse.json({ data: serializeData(res) }, { status: 200 });
		}

		const res = await prisma.payroll.create({
			data: {
				users: {
					connect: { id: body.userId },
				},
				clock_in_time: clockIn.toDate(),
				clock_in_date: date,
				clock_out_time: body.clockOutTime ? clockOut?.toDate() : undefined,
				clock_out_date: body.clockOutTime ? clockOutDate : undefined,
				gps_location: gpsLocationClockIn,
				gps_location_clock_out: body.clockOutTime
					? gpsLocationClockOut
					: undefined,
				user_weekly_payroll: {
					connect: { id: userWeeklyPayroll.id },
				},
				is_manual: true,
				created_by: session.user.email || "system",
			},
		});

		return NextResponse.json({ data: serializeData(res) }, { status: 201 });
	} catch (error) {
		console.error("Create manual payroll entry error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
