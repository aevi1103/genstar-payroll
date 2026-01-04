import type { Metadata } from "next";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { PayrollReportFilterForm } from "@/features/weekly-history/payroll-report-filter-form";
import { WeeklyPayrollHistory } from "@/features/weekly-history/weekly-payroll-history";
import { getPayrollSettings } from "./actions";
import { WeeklyNavFilter } from "@/features/history/weekly-nav-filter";
import { shortDateFormat } from "@/lib/utils";
import { WeeklyRecordSheet } from "@/features/weekly-history/weekly-record-sheet";
import { getCashAdvances } from "@/lib/db/get-cash-advances";
import { getPayrollDeductions } from "@/lib/db/get-payroll-deductions";
import { getSessionWithRole } from "@/lib/session";

export const metadata: Metadata = {
	title: "Payroll Reports",
};

type PageProps = {
	searchParams: Promise<{ weekStartDate?: string; weekEndDate?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
	const { isAdmin } = await getSessionWithRole();

	const params = await searchParams;
	const payrollSettings = await getPayrollSettings();
	const cashAdvances = await getCashAdvances(true);

	if (!params.weekStartDate || !params.weekEndDate) {
		const weekStart = dayjs()
			.startOf("week")
			.add(1, "day")
			.format(shortDateFormat);

		const weekEnd = dayjs()
			.endOf("week")
			.startOf("day")
			.format(shortDateFormat);
		const searchParams = new URLSearchParams();
		searchParams.set("weekStartDate", weekStart);
		searchParams.set("weekEndDate", weekEnd);
		const qryString = searchParams.toString();

		redirect(`/payroll/reports?${qryString}`);
	}

	const fromYear = dayjs(params.weekStartDate).year();
	const toYear = dayjs(params.weekEndDate).year();
	const payrollDeductions = await getPayrollDeductions(fromYear, toYear);

	return (
		<div className="h-full flex flex-col gap-2">
			<div className="flex flex-wrap gap-4">
				<WeeklyNavFilter btnSize={"default"} />
				<PayrollReportFilterForm />
			</div>

			<WeeklyPayrollHistory
				settings={payrollSettings}
				cashAdvances={cashAdvances}
				payrollDeductions={payrollDeductions}
			/>
			<WeeklyRecordSheet isAdmin={isAdmin} />
		</div>
	);
}
