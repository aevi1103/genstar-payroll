import { LogoutButton } from "@/components/logout-button";
import { ClockInOut } from "@/components/payroll/clock-in-out";
import { CurrentTime } from "@/components/payroll/current-time";
import { getSessionWithRole } from "@/lib/session";

export default async function ProtectedPage() {
	const session = await getSessionWithRole();

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
		</div>
	);
}
