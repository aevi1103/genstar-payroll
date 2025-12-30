"use server";

import { getSessionWithRole } from "@/lib/session";
import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { app_role } from "@prisma/client";

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

type UpdateUserData = {
	userId: string;
	field: string;
	value: string | number;
};

export const upsertUserData = async ({
	userId,
	field,
	value,
}: UpdateUserData) => {
	const { role } = await getSessionWithRole();

	if (role.toLowerCase() !== "admin") {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	try {
		// Handle role updates
		if (field === "role.role") {
			// Delete existing role and create new one
			await prisma.user_roles.deleteMany({
				where: { user_id: userId },
			});

			await prisma.user_roles.create({
				data: {
					user_id: userId,
					role: value as app_role,
				},
			});
		}

		// Handle salary updates
		if (field === "salary.salary_per_day") {
			const existingSalary = await prisma.employee_salary.findFirst({
				where: { user_id: userId },
			});

			if (existingSalary) {
				await prisma.employee_salary.update({
					where: { id: existingSalary.id },
					data: {
						salary_per_day: Number(value),
						modified_at: new Date(),
					},
				});
			} else {
				await prisma.employee_salary.create({
					data: {
						user_id: userId,
						salary_per_day: Number(value),
					},
				});
			}
		}

		// Handle profile updates
		if (field.startsWith("profile.")) {
			const profileField = field.replace("profile.", "");
			const existingProfile = await prisma.user_profiles.findFirst({
				where: { user_id: userId },
			});

			if (existingProfile) {
				await prisma.user_profiles.update({
					where: { id: existingProfile.id },
					data: {
						[profileField]: value,
						updated_at: new Date(),
					},
				});
			} else {
				await prisma.user_profiles.create({
					data: {
						user_id: userId,
						[profileField]: value,
					},
				});
			}
		}

		revalidatePath("/payroll/settings/user/profile");

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error updating user data:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to update user data",
		};
	}
};
