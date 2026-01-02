import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";

export const getActiveEmployees = async () => {
	const data = await prisma.users.findMany({
		select: {
			id: true,
			email: true,
			user_profiles: {
				select: {
					first_name: true,
					last_name: true,
					active: true,
				},
			},
		},
		where: {
			user_profiles: {
				some: {
					active: true,
				},
			},
		},
	});

	return data.map((user) => {
		const fName = user.user_profiles?.[0]?.first_name || "";
		const lName = user.user_profiles?.[0]?.last_name || "";
		const fullName = fName ? `${fName} ${lName}`.trim() : user.email;

		return {
			id: user.id,
			email: user.email,
			firstName: fName,
			lastName: lName,
			fullName: fullName || "unknown",
		};
	});
};

export type Users = Prisma.PromiseReturnType<typeof getActiveEmployees>;
export type User = NonNullable<Users>[number];
