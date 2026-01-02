import { prisma } from "@/prisma/client";

export const isActiveEmployee = async (userId: string) => {
	const useProfile = await prisma.user_profiles.findFirst({
		where: { user_id: userId },
	});

	const userRole = await prisma.user_roles.findFirst({
		where: { user_id: userId },
	});

	if (!userRole?.role) {
		return false;
	}

	return useProfile?.active ?? false;
};
