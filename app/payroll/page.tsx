import { PayrollMessageDialog } from "@/components/payroll/payroll-message-dialog";
import { CurrentTime } from "@/components/payroll/current-time";
import { PayrollHistory } from "@/components/payroll/payroll-history";
import type { Metadata } from "next";
import { getSessionWithRole } from "@/lib/session";

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

	const message = typeof messageParam === "string" ? messageParam : undefined;
	const error = typeof errorParam === "string" ? errorParam : undefined;

	return (
		<div className="flex h-full w-full flex-col gap-3">
			<div className="flex flex-col h-full gap-3">
				<p className="text-muted-foreground mt-2">
					{isAdmin
						? "View and manage clock-in and clock-out history for all employees below."
						: "View your clock-in and clock-out history below."}
				</p>

				{/* <p className="lg:text-xl text-gray-600">
					<span className="font-semibold">Current Time: </span>
					<CurrentTime />
				</p> */}

				<div className="flex-1">
					<PayrollHistory />
				</div>

				<PayrollMessageDialog message={message} error={error} />
			</div>
		</div>
	);
}
