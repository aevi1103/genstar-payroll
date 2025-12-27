import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
	const supabase = await createClient();

	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error || !session) {
		redirect("/auth/login");
	}

	let role = "user";

	try {
		role =
			jwtDecode<{ user_role?: string }>(session.access_token).user_role ??
			"user";
	} catch {
		role = "user";
	}

	return (
		<div className="flex h-svh w-full flex-col items-center justify-center gap-3">
			<p className="text-lg">
				Hello <span className="font-semibold">{session.user.email}</span>
			</p>
			<p className="text-sm text-gray-600">Role: {role}</p>
			<LogoutButton />
		</div>
	);
}
