"use client";

import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";

const validQrCodeValue =
	"https://www.genstarprintingservices.com/payroll/entry";

export default function page() {
	const handleScan = (detectedCodes: IDetectedBarcode[]) => {
		console.log("Detected codes:", detectedCodes);
		// detectedCodes is an array of IDetectedBarcode objects
		detectedCodes.forEach((code) => {
			console.log(`Format: ${code.format}, Value: ${code.rawValue}`);

			if (code.rawValue === validQrCodeValue) {
				console.log("Valid QR code detected!");
				toast.success("Valid QR code detected!");
			}
		});
	};

	return (
		<div className="h-full w-full flex flex-col justify-center items-center">
			<div className="w-full md:w-1/4 lg:w-1/2">
				<Scanner onScan={handleScan} onError={(error) => console.log(error)} />
			</div>
		</div>
	);
}
