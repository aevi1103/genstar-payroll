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
	cashAdvanceAmountPaid: number;
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

	if (!body.userId || !body.weeklyUserId || !body.cashAdvanceAmountPaid) {
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 },
		);
	}

	const userId = body.userId;
	const cashAdvanceAmountPaid = body.cashAdvanceAmountPaid;
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
			await autopayUserCashBalance(userId, cashAdvanceAmountPaid, tx);
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
			},
		});
	});

	revalidatePath("/payroll/cash-advances");
	revalidatePath("/payroll/reports");

	return NextResponse.json({ success: true });
}
