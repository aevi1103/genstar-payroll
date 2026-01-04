import { Badge } from "@/components/ui/badge";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import type { CustomCellRendererProps } from "ag-grid-react";

import React from "react";

export const StatusCellRenderer = (
	params: CustomCellRendererProps<PayrollDataSource>,
) => {
	const status = params.value;

	if (params.data?.isPaid) {
		return <Badge variant={"default"}>Paid</Badge>;
	}

	if (status === "Completed") {
		return <Badge variant={"outline"}>Completed</Badge>;
	}

	if (status === "In Progress") {
		return <Badge variant={"destructive"}>In Progress</Badge>;
	}

	return <Badge variant={"secondary"}>Not Started</Badge>;
};
