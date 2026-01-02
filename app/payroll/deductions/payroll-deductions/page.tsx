import { redirect } from "next/navigation";
import { getSessionWithRole } from "@/lib/session";
import { PayrollDeductionsFormDialog } from "@/features/payroll-deductions/payroll-deductions-form-dialog";
import { PayrollDeductionsTable } from "@/features/payroll-deductions/payroll-deductions-table";

import { getUsers, type UserProfiles } from "@/lib/db/get-user-profiles";
import {
	type PayrollDeductions,
	getPayrollDeductions,
} from "@/lib/db/get-payroll-deductions";
import { serializeData } from "@/lib/utils";

export default async function PayrollDeductionsPage() {
	const { role } = await getSessionWithRole();

	// Only admins can access this page
	if (role !== "admin") {
		redirect("/payroll");
	}

	// Fetch all employees for the form dropdown
	const employees = await getUsers();

	// Fetch all payroll deductions with employee names
	const deductionsRaw = await getPayrollDeductions();

	// Transform and serialize data
	const deductions = serializeData<PayrollDeductions>(deductionsRaw);

	return (
		<div className="flex h-full w-full flex-col gap-3">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<p className="text-muted-foreground mt-2">
					Manage employee payroll deductions (SSS, PAG-IBIG, Tax)
				</p>
				<PayrollDeductionsFormDialog
					employees={serializeData<UserProfiles>(employees)}
				/>
			</div>

			<PayrollDeductionsTable deductions={deductions} />
		</div>
	);
}
