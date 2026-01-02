"use client";

import { usePathname } from "next/navigation";
import {
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@/components/ui/breadcrumb";

const pageTitleMap: Record<string, string> = {
	"/payroll": "Hours",
	"/payroll/13monthpay": "13th Month Pay",
	"/payroll/deductions/cash-advances": "Cash Advances",
	"/payroll/entry": "Payroll Entry",
	"/payroll/qrcode": "QR Code",
	"/payroll/reports": "Payroll Reports",
	"/payroll/settings": "Settings",
	"/payroll/settings/payroll": "Payroll Settings",
	"/payroll/settings/user/profile": "User Management",
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
