import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/session";
import { CashAdvanceFormDialog } from "@/features/cash-advances/cash-advance-form-dialog";
import { CashAdvancesTable } from "@/features/cash-advances/cash-advances-table";
import { TotalUnpaidBalance } from "@/features/cash-advances/total-unpaid-balance";

import { getUsers, type UserProfiles } from "@/lib/db/get-user-profiles";
import { type CashAdvances, getCashAdvances } from "@/lib/db/get-cash-advances";
import { serializeData } from "@/lib/utils";

// Serialize BigInt fields to strings
export default async function CashAdvancesPage() {
	const { role } = await getSessionWithRole();

	// Only admins can access this page
	if (role !== "admin") {
		redirect("/payroll");
	}

	// Fetch all employees for the form dropdown
	const employees = await getUsers();

	// Fetch all cash advances with employee names
	const cashAdvancesRaw = await getCashAdvances();

	// Transform and serialize data
	const cashAdvances = serializeData<CashAdvances>(cashAdvancesRaw);

	return (
		<div className="flex h-full w-full flex-col gap-3">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<p className="text-muted-foreground mt-2">
					Manage employee cash advances and payments
				</p>
				<CashAdvanceFormDialog
					employees={serializeData<UserProfiles>(employees)}
				/>
			</div>

			<TotalUnpaidBalance cashAdvances={cashAdvances} />

			<div className="flex-1">
				<CashAdvancesTable cashAdvances={cashAdvances} />
			</div>
		</div>
	);
}
