import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

export const getUsers = async () => {
	const data = await prisma.users.findMany({
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
					middle_name: true,
				},
			},
		},
	});

	return data.map((user) => {
		const [profile] = user.user_profiles || [];

		return {
			id: user.id,
			email: user.email,
			firstName: profile.first_name,
			lastName: profile.last_name,
			middleName: profile.middle_name,
			name: profile.first_name
				? `${profile.first_name} ${profile.last_name}`
				: user.email,
		};
	});
};

export type UserProfiles = Prisma.PromiseReturnType<typeof getUsers>;
