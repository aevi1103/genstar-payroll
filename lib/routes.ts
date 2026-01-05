import type { NavMainItem } from "@/components/nav";
import { CircleDollarSign, Gauge, ShieldUser } from "lucide-react";

export const navs = {
	navMain: [
		{
			title: "Payroll Dashboard",
			url: "/payroll",
			icon: Gauge,
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
					title: "13 Month Pay",
					url: "/payroll/13monthpay",
				},
			],
		},
	] as NavMainItem[],
	settings: [
		{
			title: "Admin",
			isAdmin: true,
			isActive: true,
			url: "/payroll/settings",
			icon: ShieldUser,
			items: [
				{
					title: "QR Code",
					url: "/payroll/qrcode",
				},
				{
					title: "User Management",
					isAdmin: true,
					url: "/payroll/settings/user/profile",
				},
				{
					title: "Payroll Settings",
					url: "/payroll/settings/payroll",
				},
				{
					title: "Company Info",
					url: "/payroll/settings/company-info",
				},
			],
		},
	] as NavMainItem[],
	deductions: [
		{
			title: "Deductions",
			isActive: true,
			isAdmin: true,
			url: "/payroll/deductions",
			icon: CircleDollarSign,
			items: [
				{
					title: "Cash Advances",
					url: "/payroll/deductions/cash-advances",
				},
				{
					title: "Payroll Deductions",
					url: "/payroll/deductions/payroll-deductions",
				},
			],
		},
	] as NavMainItem[],
};
