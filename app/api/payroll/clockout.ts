import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { NextResponse } from "next/server";

dayjs.extend(weekOfYear);

export async function POST(request: Request) {
	const { session, error, role } = await getSessionWithRole();

	if (error || !session) {
		return {
			ok: false,
			response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	if (!role) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const now = dayjs();
	const today = now.toDate();
	today.setHours(0, 0, 0, 0);

	const isClockedOut = await prisma.payroll.findFirst({
		where: {
			user_id: session.user.id,
			clock_in_date: today,
			clock_out_time: {
				not: null,
			},
		},
	});

	if (isClockedOut) {
		const url = new URL("/payroll", request.url);
		const searchParams = new URLSearchParams({
			error: "Already clocked out",
		});
		url.search = searchParams.toString();
		return NextResponse.redirect(url, {
			status: 400,
		});
	}

	const payrollRecord = await prisma.payroll.findFirst({
		where: {
			user_id: session.user.id,
			clock_in_date: today,
		},
	});

	if (!payrollRecord) {
		return NextResponse.json(
			{ error: "No clock-in record found" },
			{ status: 404 },
		);
	}

	await prisma.payroll.update({
		where: {
			id: payrollRecord.id,
		},
		data: {
			clock_out_time: now.toDate(),
			clock_out_date: today,
		},
	});

	// Redirect to /payroll after a successful clock-out
	return NextResponse.redirect(new URL("/payroll", request.url), {
		status: 303,
	});
}
