import type { PayrollRecord } from "@/app/api/payroll/history/route";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const mapDataSource = (data: PayrollRecord[]) => {
	const ds = data.map((record) => {
		const salaryPerDay = record.users?.employee_salary?.[0]?.salary_per_day;
		const salaryPerHour = salaryPerDay ? Number(salaryPerDay) / 8 : null;

		const hoursWorked = dayjs(record.clock_out_time || new Date()).diff(
			dayjs(record.clock_in_time),
			"hours",
			true,
		);

		const amountEarned = salaryPerHour
			? salaryPerHour * Number(hoursWorked || 0)
			: null;

		const email = record.users?.email || "";
		const fname = record.users?.user_profiles?.[0]?.first_name || "";
		const lname = record.users?.user_profiles?.[0]?.last_name || "";
		const fullName = `${fname} ${lname}`.trim();

		return {
			...record,
			email,
			firstName: fname,
			lastName: lname,
			fullName,
			salaryPerDay,
			salaryPerHour,
			hoursWorked,
			amountEarned,
			is_manual: record.is_manual || false,
		};
	});

	return ds;
};

export type PayrollDataSource = ReturnType<typeof mapDataSource>[number];

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
				searchParams.append("weekStartDate", weekStartDate);
				searchParams.append("weekEndDate", weekEndDate);
			}

			const url = `/api/payroll/history?${searchParams.toString()}`;

			const data: PayrollRecord[] = await fetch(url).then((res) => res.json());
			return mapDataSource(data);
		},
		refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
	});
};
