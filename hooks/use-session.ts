"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@/lib/supabase/client";

export interface SessionWithRole {
	session: Session | null;
	user: User | null;
	role: string;
	isLoading: boolean;
	error: Error | null;
}

export function useSession(): SessionWithRole {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const supabase = createClient();

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session }, error }) => {
			if (error) {
				setError(error);
			} else {
				setSession(session);
			}
			setIsLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setError(null);
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth]);

	// Extract role from JWT
	let role = "user";
	if (session?.access_token) {
		try {
			role =
				jwtDecode<{ user_role?: string }>(session.access_token).user_role ??
				"user";
		} catch {
			role = "user";
		}
	}

	return {
		session,
		user: session?.user ?? null,
		role,
		isLoading,
		error,
	};
}
