import { ClockInOut } from "@/components/payroll/clock-in-out";
import { PayrollMessageDialog } from "@/components/payroll/payroll-message-dialog";
import { CurrentTime } from "@/components/payroll/current-time";
import { getSessionWithRole } from "@/lib/session";

export default async function ProtectedPage({
	searchParams,
}: {
	searchParams?: Record<string, string | string[] | undefined>;
}) {
	const session = await getSessionWithRole();
	const messageParam = searchParams?.message;
	const errorParam = searchParams?.error;

	const message = typeof messageParam === "string" ? messageParam : undefined;
	const error = typeof errorParam === "string" ? errorParam : undefined;

	return (
		<div className="flex h-full w-full flex-col gap-3">
			<h1 className="text-lg">
				Hi <span className="font-semibold">{session.user.name}!</span>
			</h1>
			<p className="text-xl text-gray-600">
				Today&apos;s Date: <CurrentTime />
			</p>

			<div>
				<ClockInOut session={session} />
			</div>

			<PayrollMessageDialog message={message} error={error} />
		</div>
	);
}
