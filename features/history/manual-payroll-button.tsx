"use client";

import { Button } from "@/components/ui/button";
import { useManualPayrollDialogStore } from "@/lib/stores/manual-payroll-dialog-store";
import { Plus } from "lucide-react";

export function ManualPayrollButton() {
	const { openDialog } = useManualPayrollDialogStore();

	return (
		<Button onClick={openDialog} size="sm" className="gap-2">
			<Plus className="h-4 w-4" />
			Add Entry
		</Button>
	);
}
