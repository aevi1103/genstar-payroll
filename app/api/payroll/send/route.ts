import type { WeeklySummaryDataSource } from "@/features/weekly-history/hooks/use-weekly-summary";
import { verifyEmailConnection } from "@/lib/email/send-email";
import { sendPayrollEmail } from "@/lib/email/send-payroll";
import { getSessionWithRole } from "@/lib/session";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { session, isAdmin } = await getSessionWithRole();

	if (!session || !isAdmin) {
		return new NextResponse(
			JSON.stringify({ error: "Unauthorized - admin only" }),
			{ status: 401 },
		);
	}

	const body = (await request
		.json()
		.catch(() => null)) as WeeklySummaryDataSource;

	if (!body) {
		return new NextResponse(JSON.stringify({ error: "Invalid request body" }), {
			status: 400,
		});
	}

	if (!body.userInfo.email) {
		return NextResponse.json(
			{
				success: false,
				error: "User email is missing",
			},
			{ status: 400 },
		);
	}

	const isConnected = await verifyEmailConnection();
	if (!isConnected) {
		return NextResponse.json(
			{
				success: false,
				error: "Failed to connect to email service",
			},
			{ status: 500 },
		);
	}

	const sendResponse = await sendPayrollEmail(body);

	return NextResponse.json(
		{
			success: sendResponse,
			message: sendResponse
				? "Payroll email sent successfully"
				: "Failed to send payroll email",
		},
		{ status: sendResponse ? 200 : 500 },
	);
}
