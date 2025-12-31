"use client";

import { usePathname } from "next/navigation";
import {
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@/components/ui/breadcrumb";

const pageTitleMap: Record<string, string> = {
	"/payroll": "Hours",
	"/payroll/reports": "Payroll Reports",
	"/payroll/qrcode": "QR Code",
	"/payroll/entry": "Payroll Entry",
	"/payroll/settings": "Settings",
	"/payroll/settings/payroll": "Payroll Settings",
	"/payroll/settings/user/profile": "User Profile",
	"/dashboard": "Dashboard",
	"/account": "Account",
	"/admin/users": "Users Management",
};

const DynamicBreadcrumb = () => {
	const pathname = usePathname();
	const currentPageTitle =
		pageTitleMap[pathname] || "Payroll Management System";
	const currentPageUrl = pathname || "#";

	return (
		<BreadcrumbList>
			<BreadcrumbItem className="hidden md:block">
				<BreadcrumbLink href={currentPageUrl}>
					{currentPageTitle}
				</BreadcrumbLink>
			</BreadcrumbItem>
		</BreadcrumbList>
	);
};

export default DynamicBreadcrumb;
