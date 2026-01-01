import type { PayrollRecord } from "@/app/api/payroll/history/route";
import type { PayrollSettings } from "@/lib/db/get-payroll-settings";
import { mapPayrollDataSource } from "@/lib/map-payroll-datasource";
import { useMemo } from "react";

export const useMapPayrollDatasource = ({
	data,
	settings,
}: {
	data: PayrollRecord[];
	settings: PayrollSettings | undefined;
}) => {
	const ds = useMemo(
		() =>
			mapPayrollDataSource({
				data,
				settings,
			}),
		[data, settings],
	);

	return {
		data: ds,
	};
};
