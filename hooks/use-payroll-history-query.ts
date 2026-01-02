import type { PayrollRecord } from "@/app/api/payroll/history/route";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export interface PayrollHistoryQueryParams {
	weekStartDate?: string;
	weekEndDate?: string;
}

export const usePayrollHistoryQuery = ({
	weekStartDate,
	weekEndDate,
}: PayrollHistoryQueryParams) => {
	return useQuery({
		queryKey: [
			"payroll-history",
			{
				weekStartDate,
				weekEndDate,
			},
		],
		queryFn: async () => {
			const searchParams = new URLSearchParams();
			if (weekStartDate && weekEndDate) {
				searchParams.append(
					"weekStartDate",
					dayjs(weekStartDate).startOf("day").toISOString(),
				);
				searchParams.append(
					"weekEndDate",
					dayjs(weekEndDate).endOf("day").toISOString(),
				);
			}

			const url = `/api/payroll/history?${searchParams.toString()}`;

			const data: PayrollRecord[] = await fetch(url).then((res) => res.json());
			return data;
		},
		refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
	});
};
