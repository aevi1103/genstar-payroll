"use server";

import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

export const getUsers = async () => {
	const { role } = await getSessionWithRole();

	if (role.toLowerCase() !== "admin") {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	const users = await prisma.users.findMany({
		select: {
			id: true,
			email: true,
			user_roles: true,
			user_profiles: true,
			employee_salary: true,
		},
	});

	return {
		success: true,
		data: users.map((user) => {
			return {
				id: user.id,
				email: user.email,
				role: user.user_roles?.[0],
				profile: user.user_profiles?.[0],
				salary: user.employee_salary?.[0],
			};
		}),
	};
};

export type Users = Prisma.PromiseReturnType<typeof getUsers>["data"];
export type User = NonNullable<Users>[number];
