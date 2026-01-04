import { autopayUserCashBalance } from "@/lib/db/autopay-user-cash-balance";
import { getUserRemainingCashAdvBalance } from "@/lib/db/get-user-remaining-cash-adv-balance";
import { isActiveEmployee } from "@/lib/db/is-active-employee";
import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export interface PayUserCashAdvanceRequestBody {
	userId: string | null | undefined;
	weeklyUserId: string;
	paidCashAdvance: number;
	paidSss: number;
	paidPagibig: number;
	remainingCashAdvanceBalance: number;
	remarks?: string;
}

export async function POST(request: Request) {
	const { session } = await getSessionWithRole();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const isActive = await isActiveEmployee(session.user.id);

	if (!isActive) {
		return NextResponse.json(
			{ error: "Forbidden - inactive employee" },
			{ status: 403 },
		);
	}

	const body = (await request
		.json()
		.catch(() => null)) as PayUserCashAdvanceRequestBody | null;

	if (!body) {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}

	const missingFields: string[] = [];

	if (!body.userId) missingFields.push("userId");
	if (!body.weeklyUserId) missingFields.push("weeklyUserId");
	if (!body.paidCashAdvance && body.paidCashAdvance !== 0)
		missingFields.push("paidCashAdvance");
	if (!body.paidSss && body.paidSss !== 0) missingFields.push("paidSss");
	if (!body.paidPagibig && body.paidPagibig !== 0)
		missingFields.push("paidPagibig");
	if (
		!body.remainingCashAdvanceBalance &&
		body.remainingCashAdvanceBalance !== 0
	)
		missingFields.push("remainingCashAdvanceBalance");

	if (missingFields.length > 0) {
		return NextResponse.json(
			{ error: "Missing required fields", missingFields },
			{ status: 400 },
		);
	}

	const userId = body.userId || "";
	const paidCashAdvance = body.paidCashAdvance;
	const paidSss = body.paidSss;
	const paidPagibig = body.paidPagibig;
	const remarks = body.remarks || null;

	const record = await prisma.user_weekly_payroll.findUnique({
		where: {
			id: Number.parseInt(body.weeklyUserId, 10),
		},
	});

	if (!record) {
		return NextResponse.json(
			{ error: "User weekly payroll record not found" },
			{ status: 404 },
		);
	}

	await prisma.$transaction(async (tx) => {
		// automatic update of cash advance payment should only be allowed if there is an outstanding balance
		const remainingBalance = await getUserRemainingCashAdvBalance(userId);

		if (remainingBalance > 0) {
			await autopayUserCashBalance(userId, paidCashAdvance, tx);
		}

		await tx.user_weekly_payroll.update({
			where: {
				id: record.id,
			},
			data: {
				is_paid: true,
				paid_at: new Date(),
				notes: remarks,
				modified_at: new Date(),
				modified_by: session.user.email || "system",
				paid_cash_advacne: paidCashAdvance,
				paid_sss: paidSss,
				paid_pagibig: paidPagibig,
				current_cash_advance_balance: body.remainingCashAdvanceBalance,
			},
		});
	});

	revalidatePath("/payroll/cash-advances");
	revalidatePath("/payroll/reports");

	return NextResponse.json({ success: true });
}
