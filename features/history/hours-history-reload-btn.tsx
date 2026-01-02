"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePayrollHistoryQuery } from "@/hooks/use-payroll-history-query";
import { RefreshCcw } from "lucide-react";
import React from "react";

export const HoursHistoryReloadBtn = () => {
	const { refetch, isFetching } = usePayrollHistoryQuery({
		weekStartDate: undefined,
		weekEndDate: undefined,
	});

	return (
		<Button
			disabled={isFetching}
			size="sm"
			variant="outline"
			onClick={() => {
				refetch();
			}}
			className="cursor-pointer"
		>
			{isFetching ? <Spinner /> : <RefreshCcw />}
		</Button>
	);
};
