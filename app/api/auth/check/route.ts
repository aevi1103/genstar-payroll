import { getSessionWithRole } from "@/lib/session";
import { isActiveEmployee } from "@/lib/db/is-active-employee";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { session } = await getSessionWithRole();

		if (!session) {
			return NextResponse.json(
				{ session: null, isActive: false },
				{ status: 200 },
			);
		}

		const isActive = await isActiveEmployee(session.user.id);

		return NextResponse.json({ session: !!session, isActive }, { status: 200 });
	} catch (error) {
		console.error("Auth check error:", error);
		return NextResponse.json(
			{ session: null, isActive: false, error: "Auth check failed" },
			{ status: 500 },
		);
	}
}
