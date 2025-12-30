import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

const serializeData = (data: unknown): unknown => {
	return JSON.parse(
		JSON.stringify(data, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		),
	);
};

export const getPayrollHistory = async (userId: string) => {
	return await prisma.payroll.findMany({
		where: {
			user_id: userId,
		},
		orderBy: {
			clock_in_time: "desc",
		},
		include: {
			users: {
				select: {
					employee_salary: {
						select: {
							salary_per_day: true,
						},
					},
				},
			},
		},
	});
};

export type PayrollRecord = Prisma.PromiseReturnType<
	typeof getPayrollHistory
>[number];

export async function GET(request: Request) {
	try {
		const session = await getSessionWithRole();

		if (!session.session) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!session.role) {
			return Response.json(
				{ error: "Forbidden - insufficient permissions" },
				{ status: 403 },
			);
		}

		const data = await getPayrollHistory(session.session.user.id);

		return Response.json(serializeData(data), { status: 200 });
	} catch (error) {
		console.error("Payroll history error:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";

		return Response.json({ error: errorMessage }, { status: 500 });
	}
}
