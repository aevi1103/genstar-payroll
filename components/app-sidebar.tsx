"use client";

import type * as React from "react";
import { Nav, type NavMainItem } from "@/components/nav";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import type { SessionWithRole } from "@/lib/session";
import Link from "next/link";
import { navs } from "@/lib/routes";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	session: SessionWithRole;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
	const displayUser = {
		name: session.user.name ?? "User",
		email: session.user?.email ?? "genstar.printing@genstar.com",
		avatar: session?.user.avatar ?? "/avatars/shadcn.jpg",
	};

	const logoSrc = encodeURI("/genstar logo.png");
	const isAdmin = session.role.toLowerCase() === "admin";

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-2">
					<Link href={"/"}>
						<Image
							src={logoSrc}
							alt="GenStar Payroll"
							width={150}
							height={50}
							className="h-auto w-1/2 sm:w-2/3 lg:w-3/4 cursor-pointer"
							priority
						/>
					</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<Nav items={navs.navMain} />
				{isAdmin && (
					<>
						<Nav items={navs.deductions} />
						<Nav items={navs.settings} />
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={displayUser} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
