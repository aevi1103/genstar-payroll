import { ClockInOutQrCode } from "@/components/payroll/qr-code";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getSessionWithRole } from "@/lib/session";
import { AlertCircleIcon } from "lucide-react";

// export const metadata: Metadata = {
// 	title: "Payroll QR Code",
// };

export default async function QrCode() {
	const { session, role } = await getSessionWithRole();

	if (!session || role.toLowerCase() !== "admin") {
		return (
			<Alert variant="destructive">
				<AlertCircleIcon />
				<AlertTitle>Unauthorized</AlertTitle>
				<AlertDescription>
					<p>You do not have permission to view this page.</p>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full w-full flex flex-col gap-4 justify-center items-center">
			<p className="text-gray-600 max-w-md text-center lg:text-lg">
				Use your phone to scan this QR code to clock in or out. You will need a
				valid Genstar account—sign in if prompted—and your administrator must
				approve your account before you can proceed.
			</p>

			<ClockInOutQrCode />
			<p className="text-2xl">Scan to Clock-in or Clock-out</p>
		</div>
	);
}
