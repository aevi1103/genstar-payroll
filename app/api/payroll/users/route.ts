import { NextResponse } from "next/server";
import { getSessionWithRole } from "@/lib/session";
import { getActiveEmployees } from "@/lib/db/get-active-employees";
import { isActiveEmployee } from "@/lib/db/is-active-employee";

export async function GET() {
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
	try {
		const data = await getActiveEmployees();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Fetch users error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
