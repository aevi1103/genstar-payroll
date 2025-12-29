"use client";
import { QRCode } from "@/components/ui/shadcn-io/qr-code";
import { useState } from "react";

export default function QrCode() {
	const [url] = useState<string | null>(() => {
		if (typeof window === "undefined") return null;
		return new URL("/payroll/entry", window.location.origin).toString();
	});

	return (
		<div className="h-full w-full flex flex-col gap-4 justify-center items-center">
			<p className="text-center text-gray-600 max-w-sm">
				Scan the QR code with your phone to clock in or out. You must have a
				valid Genstar account.
			</p>

			{url ? <QRCode className="size-1/2 " data={url} /> : null}
			<p className="text-2xl">Scan to Clock-in or Clock-out</p>
		</div>
	);
}
