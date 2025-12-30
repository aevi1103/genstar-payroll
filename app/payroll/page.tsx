import { PayrollMessageDialog } from "@/components/payroll/payroll-message-dialog";
import { CurrentTime } from "@/components/payroll/current-time";
import { PayrollHistory } from "@/components/payroll/payroll-history";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Payroll Hours",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
export default async function ProtectedPage({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	const messageParam = (await searchParams)?.message;
	const errorParam = (await searchParams)?.error;

	const message = typeof messageParam === "string" ? messageParam : undefined;
	const error = typeof errorParam === "string" ? errorParam : undefined;

	return (
		<div className="flex h-full w-full flex-col gap-3">
			<div className="flex flex-col h-full gap-3">
				{/* <h1 className="text-lg">
					Hi <span className="font-semibold">{session.user.name}!</span>
				</h1> */}
				<p className="text-xl text-gray-600">
					Today&apos;s Date: <CurrentTime />
				</p>

				<div className="flex-1">
					<PayrollHistory />
				</div>

				<PayrollMessageDialog message={message} error={error} />
			</div>
		</div>
	);
}
