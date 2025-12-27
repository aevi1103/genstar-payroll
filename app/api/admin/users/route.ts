import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

const ALLOWED_ROLES = ["admin", "user"] as const;

type AllowedRole = (typeof ALLOWED_ROLES)[number];

type AdminCheckResult =
	| { ok: true; userId: string }
	| { ok: false; response: NextResponse };

async function requireAdmin(): Promise<AdminCheckResult> {
	const supabase = await createServerClient();
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error || !session) {
		return {
			ok: false,
			response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
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
		return {
			ok: false,
			response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
		};
	}

	return { ok: true, userId: session.user.id };
}

export async function GET() {
	const adminCheck = await requireAdmin();
	if (!adminCheck.ok) return adminCheck.response;

	const adminClient = createServiceClient();
	const { data, error } = await adminClient.auth.admin.listUsers({
		page: 1,
		perPage: 200,
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	const users = (data?.users ?? []).map((user) => ({
		id: user.id,
		email: user.email,
		role: (user.app_metadata as { role?: string } | undefined)?.role ?? "user",
	}));

	return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
	const adminCheck = await requireAdmin();
	if (!adminCheck.ok) return adminCheck.response;

	const body = (await request.json().catch(() => null)) as {
		userId?: string;
		role?: AllowedRole;
	} | null;
	const role = body?.role;
	const userId = body?.userId;

	if (!role || !userId || !ALLOWED_ROLES.includes(role)) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}

	const adminClient = createServiceClient();
	const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
		app_metadata: { role },
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		user: {
			id: data.user?.id,
			email: data.user?.email,
			role:
				(data.user?.app_metadata as { role?: string } | undefined)?.role ??
				"user",
		},
	});
}
