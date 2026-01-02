import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/prisma/client";
import { isActiveEmployee } from "../db/is-active-employee";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	// With Fluid compute, don't put this client in a global environment
	// variable. Always create a new one on each request.
	const supabase = createServerClient(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					// biome-ignore lint/complexity/noForEach: <explanation>
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					// biome-ignore lint/complexity/noForEach: <explanation>
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// Do not run code between createServerClient and
	// supabase.auth.getClaims(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.

	// IMPORTANT: If you remove getClaims() and you use server-side rendering
	// with the Supabase client, your users may be randomly logged out.
	const { data } = await supabase.auth.getClaims();
	const user = data?.claims;

	const pathname = request.nextUrl.pathname;
	const isAuthRoute =
		pathname.startsWith("/login") || pathname.startsWith("/auth");

	const isPublicRoute = pathname === "/" || isAuthRoute;
	const isPayrollRoute = pathname.startsWith("/payroll");

	if (!user && !isPublicRoute) {
		// no user, potentially respond by redirecting the user to the login page
		const url = request.nextUrl.clone();
		url.pathname = "/auth/login";
		return NextResponse.redirect(url);
	}

	// Check role access for payroll routes
	if (user && isPayrollRoute) {
		try {
			const userRoles = await prisma.user_roles.findFirst({
				where: {
					user_id: user.sub,
				},
			});

			if (!userRoles) {
				// No role assigned, redirect to home with message
				const url = request.nextUrl.clone();
				url.pathname = "/";
				url.searchParams.set("message", "no role assigned to user");
				return NextResponse.redirect(url);
			}

			const isActive = await isActiveEmployee(user.sub);

			if (!isActive) {
				// Inactive employee, redirect to home with message
				const url = request.nextUrl.clone();
				url.pathname = "/";
				url.searchParams.set(
					"message",
					"your account is marked as inactive. please contact admin",
				);
				return NextResponse.redirect(url);
			}
		} catch (error) {
			console.error("Error checking user roles:", error);
			// On error, redirect to home with message
			const url = request.nextUrl.clone();
			url.pathname = "/";
			url.searchParams.set("message", "no role assigned to user");
			return NextResponse.redirect(url);
		}
	}

	// IMPORTANT: You *must* return the supabaseResponse object as it is.
	// If you're creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!

	return supabaseResponse;
}
