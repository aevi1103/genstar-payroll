import { ClockInOut } from "@/components/payroll/clock-in-out";
import { PayrollMessageDialog } from "@/components/payroll/payroll-message-dialog";
import { CurrentTime } from "@/components/payroll/current-time";
import { getSessionWithRole } from "@/lib/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
export default async function ProtectedPage({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	const session = await getSessionWithRole();
	const messageParam = (await searchParams)?.message;
	const errorParam = (await searchParams)?.error;

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

			{message && <p className="text-md text-green-600">{message}</p>}
			{error && <p className="text-md text-red-600">{error}</p>}

			<div>
				<ClockInOut session={session} />
			</div>

			<PayrollMessageDialog message={message} error={error} />
		</div>
	);
}
