import { PayrollReportFilterForm } from "@/features/weekly-history/payroll-report-filter-form";
import { shortDateFormat } from "@/lib/utils";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import React from "react";
import { getPayrollSettings } from "../reports/actions";
import { getCashAdvances } from "@/lib/db/get-cash-advances";
import { getPayrollDeductions } from "@/lib/db/get-payroll-deductions";
import { ThirteenthMonthTable } from "@/features/13month/13month-table";

type PageProps = {
	searchParams: Promise<{ weekStartDate?: string; weekEndDate?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
	const params = await searchParams;

	if (!params.weekStartDate || !params.weekEndDate) {
		const weekStart = dayjs()
			.startOf("year")
			.add(1, "week")
			.startOf("week")
			.format(shortDateFormat);

		const weekEnd = dayjs()
			.endOf("year")
			.subtract(1, "week")
			.endOf("week")
			.format(shortDateFormat);

		const searchParams = new URLSearchParams();
		searchParams.set("weekStartDate", weekStart);
		searchParams.set("weekEndDate", weekEnd);
		const qryString = searchParams.toString();

		redirect(`/payroll/13monthpay?${qryString}`);
	}

	const payrollSettings = await getPayrollSettings();
	const cashAdvances = await getCashAdvances(true);

	const fromYear = dayjs(params.weekStartDate).year();
	const toYear = dayjs(params.weekEndDate).year();
	const payrollDeductions = await getPayrollDeductions(fromYear, toYear);

	return (
		<div className="h-full flex flex-col gap-3">
			<PayrollReportFilterForm />

			<ThirteenthMonthTable
				settings={payrollSettings}
				cashAdvances={cashAdvances}
				payrollDeductions={payrollDeductions}
			/>
		</div>
	);
}
