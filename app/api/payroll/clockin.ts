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

	const isClockedIn = await prisma.payroll.findFirst({
		where: {
			user_id: session.user.id,
			clock_in_date: today,
			clock_out_time: null,
		},
	});

	if (isClockedIn) {
		const url = new URL("/payroll", request.url);
		const searchParams = new URLSearchParams({ error: "Already clocked in" });
		url.search = searchParams.toString();
		return NextResponse.redirect(url, {
			status: 400,
		});
	}

	await prisma.payroll.create({
		data: {
			user_id: session.user.id,
			clock_in_time: now.toDate(),
			clock_in_date: today,
			created_at: now.toDate(),
			payroll_week: now.week(),
			payroll_year: now.year(),
		},
	});

	// Redirect to /payroll after a successful clock-in
	return NextResponse.redirect(new URL("/payroll", request.url), {
		status: 303,
	});
}
