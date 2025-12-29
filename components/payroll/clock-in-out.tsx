import type { SessionWithRole } from "@/lib/session";
import { clockInOut } from "@/app/payroll/entry/actions";
import { Button } from "../ui/button";

export const ClockInOut = ({ session }: { session: SessionWithRole }) => {
	void session; // session is already validated upstream; retained for type clarity

	return (
		<form action={clockInOut}>
			<Button type="submit" variant="outline">
				Clock In / Out
			</Button>
		</form>
	);
};
