"use client";

import type * as React from "react";
import { SquareTerminal } from "lucide-react";
import { NavMain, type NavMainItem } from "@/components/nav-main";
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

const userNavs: { navMain: NavMainItem[] } = {
	navMain: [
		{
			title: "Payroll Dashboard",
			url: "/payroll",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "My Payroll",
					url: "/payroll",
				},
				{
					title: "Payroll Reports",
					url: "/payroll/reports",
				},
				{
					title: "QR Code",
					url: "/payroll/qrcode",
				},
			],
		},
	],
};

const adminNavs = {
	navMain: userNavs.navMain,
	settings: [],
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
	const data = session.role.toLowerCase() === "admin" ? adminNavs : userNavs;

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
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={displayUser} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
