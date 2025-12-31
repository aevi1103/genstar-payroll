import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getSessionWithRole } from "@/lib/session";
import type { Prisma } from "@prisma/client";

const getUsers = async () => {
	const users = await prisma.users.findMany({
		where: {
			user_roles: {
				some: {
					role: {
						in: ["admin", "user"],
					},
				},
			},
		},
		select: {
			id: true,
			email: true,
			user_profiles: {
				select: {
					first_name: true,
					last_name: true,
				},
			},
		},
	});

	return users.map((user) => {
		const fName = user.user_profiles?.[0]?.first_name || undefined;
		const lName = user.user_profiles?.[0]?.last_name || undefined;
		const fullName = [fName, lName].filter(Boolean).join(" ") || undefined;
		const name = fullName?.trim().length ? fullName : user.email;

		return {
			...user,
			first_name: fName,
			last_name: lName,
			name: name || undefined,
			full_name: fullName || undefined,
		};
	});
};

export type Users = Prisma.PromiseReturnType<typeof getUsers>;
export type User = NonNullable<Users>[number];

export async function GET() {
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
		const data = await getUsers();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Fetch users error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal server error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
