import { PayrollMessageDialog } from "@/features/history/payroll-message-dialog";

import { PayrollHistory } from "@/features/history/payroll-history";
import { ManualPayrollEntryFormDialog } from "@/features/manual-payroll-entry/manual-payroll-entry-form-dialog";
import { ManualPayrollButton } from "@/features/history/manual-payroll-button";
import type { Metadata } from "next";
import { getSessionWithRole } from "@/lib/session";
import { getPayrollSettingsData } from "@/lib/db/get-payroll-settings";
import { HoursHistoryReloadBtn } from "@/features/history/hours-history-reload-btn";
import { UserLocationDialog } from "@/features/history/user-location-dialog";
import { WeeklyNavFilter } from "@/features/history/weekly-nav-filter";
import { PayrollRecordSheet } from "@/features/history/record-sheet";

export const metadata: Metadata = {
	title: "Payroll Hours",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
export default async function ProtectedPage({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	const { role } = await getSessionWithRole();
	const isAdmin = role.toLowerCase() === "admin";

	const messageParam = (await searchParams)?.message;
	const errorParam = (await searchParams)?.error;
	const timeParam = (await searchParams)?.time as string | undefined;

	const message = typeof messageParam === "string" ? messageParam : undefined;
	const error = typeof errorParam === "string" ? errorParam : undefined;

	const settings = await getPayrollSettingsData();

	return (
		<div className="flex h-full w-full flex-col gap-3">
			<div className="flex flex-col h-full gap-3">
				<div className="flex gap-4 flex-wrap items-center">
					<WeeklyNavFilter />

					<div className="flex gap-1 flex-wrap">
						{isAdmin && <ManualPayrollButton />}
						<HoursHistoryReloadBtn />
					</div>
				</div>

				<PayrollHistory isAdmin={isAdmin} settings={settings} />
			</div>

			<PayrollMessageDialog message={message} error={error} time={timeParam} />
			<ManualPayrollEntryFormDialog />
			<UserLocationDialog />
			<PayrollRecordSheet />
		</div>
	);
}
