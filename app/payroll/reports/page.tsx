import React from "react";
import type { Metadata } from "next";
import { PayrollReportFilterForm } from "@/components/payroll/payroll-report-filter-form";

export const metadata: Metadata = {
	title: "Payroll Reports",
};

export default function Page() {
	return (
		<div className="h-full flex flex-col gap-2">
			<div>
				<PayrollReportFilterForm />
			</div>
		</div>
	);
}
