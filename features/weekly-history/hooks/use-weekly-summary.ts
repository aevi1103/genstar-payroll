import type { PayrollSettingsResponse } from "@/app/payroll/reports/actions";
import type { CashAdvances } from "@/lib/db/get-cash-advances";
import type { PayrollDeductions } from "@/lib/db/get-payroll-deductions";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import { useMemo } from "react";
import { mapWeeklySummaryData } from "../utils/utils";

interface UseWeeklySummaryProps {
	data: PayrollDataSource[];
	settings: PayrollSettingsResponse;
	cashAdvances: CashAdvances;
	payrollDeductions: PayrollDeductions;
}

export type WeeklySummaryDataSource = ReturnType<
	typeof mapWeeklySummaryData
>[number];

export const useWeeklySummary = (params: UseWeeklySummaryProps) => {
	const dataSource = useMemo(() => mapWeeklySummaryData(params), [params]);

	return {
		data: dataSource,
	} as {
		data: WeeklySummaryDataSource[];
	};
};
