import { QrScanner } from "@/features/qr-code-scanner/qr-scanner";

const validQrCodeValue =
	"https://www.genstarprintingservices.com/payroll/entry";

export default function page() {
	const validUrl = process.env.VALID_QR_CODE_LOGIN_URL || validQrCodeValue;

	return (
		<div className="h-full w-full flex flex-col justify-center items-center">
			<div className="w-full md:w-1/4 lg:w-1/2">
				<QrScanner validUrl={validUrl} />
			</div>
		</div>
	);
}
