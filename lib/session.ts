import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@/lib/supabase/server";

/**
 * Get the current session with role information
 * @param redirectOnError - Whether to redirect to login if session is invalid (default: true)
 * @returns Session data with user and role
 */
export async function getSessionWithRole(redirectOnError = true) {
	const supabase = await createClient();

	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error || !session) {
		if (redirectOnError) {
			redirect("/auth/login");
		}
		throw new Error(error?.message || "No session found");
	}

	let role = "user";
	try {
		role =
			jwtDecode<{ user_role?: string }>(session.access_token).user_role ??
			"user";
	} catch {
		role = "user";
	}

	const isAdmin = role.toLocaleLowerCase() === "admin";

	return {
		session,
		user: {
			id: session.user.id,
			email: session.user.email,
			name: (session.user.user_metadata?.full_name ||
				session.user.email ||
				"User") as string,
			avatar: (session.user.user_metadata?.avatar_url ||
				"/avatars/shadcn.jpg") as string,
		},
		role,
		isAdmin,
		error,
	};
}

export type SessionWithRole = Awaited<ReturnType<typeof getSessionWithRole>>;
