import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { PayrollReportFilterForm } from "@/features/reports/payroll-report-filter-form";

export const metadata: Metadata = {
	title: "Payroll Reports",
};

type PageProps = {
	searchParams: Promise<{ weekStartDate?: string; weekEndDate?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
	const params = await searchParams;

	if (!params.weekStartDate || !params.weekEndDate) {
		const weekStart = dayjs()
			.startOf("week")
			.add(1, "day")
			.format("YYYY-MM-DD");

		const weekEnd = dayjs().endOf("week").startOf("day").format("YYYY-MM-DD");
		const searchParams = new URLSearchParams();
		searchParams.set("weekStartDate", weekStart);
		searchParams.set("weekEndDate", weekEnd);
		const qryString = searchParams.toString();

		redirect(`/payroll/reports?${qryString}`);
	}

	return (
		<div className="h-full flex flex-col gap-2">
			<div>
				<PayrollReportFilterForm />
			</div>
		</div>
	);
}
