"use client";
import { QRCode } from "@/components/ui/shadcn-io/qr-code";
import { useState } from "react";
import { useIsClient } from "@uidotdev/usehooks";

// export const metadata: Metadata = {
// 	title: "Payroll QR Code",
// };

export default function QrCode() {
	const isClient = useIsClient();

	const [url] = useState<string | null>(() => {
		if (typeof window === "undefined") return null;
		return new URL("/payroll/entry", window.location.origin).toString();
	});

	if (!isClient) return null;

	return (
		<div className="h-full w-full flex flex-col gap-4 justify-center items-center">
			<p className="text-gray-600 max-w-md text-center lg:text-lg">
				Use your phone to scan this QR code to clock in or out. You will need a
				valid Genstar account—sign in if prompted—and your administrator must
				approve your account before you can proceed.
			</p>

			{url ? <QRCode className="size-1/2 " data={url} /> : null}
			<p className="text-2xl">Scan to Clock-in or Clock-out</p>
		</div>
	);
}
