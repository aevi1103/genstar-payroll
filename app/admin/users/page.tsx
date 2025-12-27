import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

import { type UserRow, UsersTable } from "@/components/admin/users-table";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const redirectTo = "/payroll";

export default async function AdminUsersPage() {
	const supabase = await createClient();
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error || !session) {
		redirect("/auth/login");
	}

	let role: string | undefined;

	try {
		({ user_role: role } = jwtDecode<{ user_role?: string }>(
			session.access_token,
		));
	} catch {
		role = undefined;
	}
	if (role !== "admin") {
		redirect(redirectTo);
	}

	const adminClient = createServiceClient();
	const { data, error: listError } = await adminClient.auth.admin.listUsers({
		page: 1,
		perPage: 200,
	});

	if (listError) {
		throw new Error(listError.message);
	}

	const users = (data?.users ?? []).map((entry) => ({
		id: entry.id,
		email: entry.email,
		role: (entry.app_metadata as { role?: string } | undefined)?.role ?? "user",
	})) as UserRow[];

	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
			<div>
				<p className="text-sm text-gray-500">Admin settings</p>
				<h1 className="text-2xl font-semibold text-gray-900">User roles</h1>
				<p className="text-sm text-gray-600">
					Promote or demote users. Changes write to Supabase app_metadata.role.
				</p>
			</div>
			<UsersTable initialUsers={users} />
		</div>
	);
}
