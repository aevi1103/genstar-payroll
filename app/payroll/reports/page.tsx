import type { Metadata } from "next";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { PayrollReportFilterForm } from "@/features/weekly-history/payroll-report-filter-form";
import { WeeklyPayrollHistory } from "@/features/weekly-history/weekly-payroll-history";
import { getPayrollSettings } from "./actions";

export const metadata: Metadata = {
	title: "Payroll Reports",
};

type PageProps = {
	searchParams: Promise<{ weekStartDate?: string; weekEndDate?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
	const params = await searchParams;
	const payrollSettings = await getPayrollSettings();

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
			<PayrollReportFilterForm />
			<WeeklyPayrollHistory settings={payrollSettings} />
		</div>
	);
}
