import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";

const serializeData = (data: unknown): unknown => {
	return JSON.parse(
		JSON.stringify(data, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		),
	);
};

interface PayrollHistoryParams {
	userId: string;
	isAdmin: boolean;
	weekStartDate?: string;
	weekEndDate?: string;
}

export const getPayrollHistory = async (params: PayrollHistoryParams) => {
	let qry: Prisma.payrollFindManyArgs["where"] = params.isAdmin
		? {}
		: { user_id: params.userId };

	if (params.weekStartDate && params.weekEndDate) {
		const weekStart = dayjs(params.weekStartDate).startOf("day").toDate();
		const weekEnd = dayjs(params.weekEndDate).endOf("day").toDate();

		qry = {
			...qry,
			user_weekly_payroll: {
				week_start: {
					gte: weekStart,
				},
				week_end: {
					lte: weekEnd,
				},
			},
		};
	}

	return await prisma.payroll.findMany({
		where: qry,
		orderBy: {
			created_at: "desc",
		},
		include: {
			users: {
				select: {
					id: true,
					email: true,
					user_profiles: {
						select: {
							first_name: true,
							last_name: true,
							middle_name: true,
						},
					},
					employee_salary: {
						select: {
							salary_per_day: true,
						},
					},
				},
			},
			user_weekly_payroll: true,
		},
	});
};

export type PayrollRecord = Prisma.PromiseReturnType<
	typeof getPayrollHistory
>[number];

export async function GET(request: Request) {
	try {
		const { session, role } = await getSessionWithRole();

		if (!session) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!role) {
			return Response.json(
				{ error: "Forbidden - insufficient permissions" },
				{ status: 403 },
			);
		}

		const data = await getPayrollHistory({
			userId: session.user.id,
			isAdmin: role.toLowerCase() === "admin",
		});

		return Response.json(serializeData(data), { status: 200 });
	} catch (error) {
		console.error("Payroll history error:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";

		return Response.json({ error: errorMessage }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const { session, role } = await getSessionWithRole();

		if (!session) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!role) {
			return Response.json(
				{ error: "Forbidden - insufficient permissions" },
				{ status: 403 },
			);
		}

		const { id } = await request.json();

		if (!id) {
			return Response.json(
				{ error: "Payroll record ID is required" },
				{ status: 400 },
			);
		}

		const isAdmin = role.toLowerCase() === "admin";

		// Check if the record exists and belongs to the user (if not admin)
		const record = await prisma.payroll.findUnique({
			where: { id },
		});

		if (!record) {
			return Response.json(
				{ error: "Payroll record not found" },
				{ status: 404 },
			);
		}

		// Non-admin users can only delete their own records
		if (!isAdmin && record.user_id !== session.user.id) {
			return Response.json(
				{ error: "Forbidden - you can only delete your own records" },
				{ status: 403 },
			);
		}

		await prisma.payroll.delete({
			where: { id },
		});

		return Response.json(
			{ message: "Payroll record deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Delete payroll record error:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";

		return Response.json({ error: errorMessage }, { status: 500 });
	}
}
