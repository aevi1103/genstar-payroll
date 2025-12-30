"use client";

import type * as React from "react";
import { SquareTerminal } from "lucide-react";
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

const navs = {
	navMain: [
		{
			title: "Payroll Dashboard",
			url: "/payroll",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Hours",
					url: "/payroll",
				},
				{
					title: "Payroll",
					url: "/payroll/reports",
				},
				{
					title: "QR Code",
					url: "/payroll/qrcode",
				},
			],
		},
	] as NavMainItem[],
	settings: [
		{
			title: "Settings",
			isAdmin: true,
			isActive: true,
			url: "/payroll/settings",
			icon: SquareTerminal,
			items: [
				{
					title: "User Profile",
					isAdmin: true,
					url: "/payroll/settings/user/profile",
				},
				{
					title: "Payroll Settings",
					url: "/payroll/settings/payroll",
				},
			],
		},
	] as NavMainItem[],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	session: SessionWithRole;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
	const displayUser = {
		name: session.user.name ?? "User",
		email: session.user?.email ?? "user@example.com",
		avatar: session?.user.avatar ?? "/avatars/shadcn.jpg",
	};

	const logoSrc = encodeURI("/genstar logo.png");
	const isAdmin = session.role.toLowerCase() === "admin";

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-2">
					<Image
						src={logoSrc}
						alt="GenStar Payroll"
						width={180}
						height={50}
						className="mx-auto h-auto w-1/2 sm:w-2/3 lg:w-full"
						priority
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<Nav items={navs.navMain} />
				{isAdmin && <Nav items={navs.settings} />}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={displayUser} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
