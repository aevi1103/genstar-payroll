"use client";
import { QRCode } from "@/components/ui/shadcn-io/qr-code";
import React from "react";

export default function QrCode() {
	const url = new URL("/api/payroll/clock-in-out", window.location.origin);

	return (
		<div className="h-full w-full flex flex-col gap-4 justify-center items-center">
			<p className="text-center text-gray-600 max-w-sm">
				Scan the QR code with your phone to clock in or out. You must have a
				valid Genstar account.
			</p>

			<QRCode className="size-1/2 " data={url.toString()} />
			<p className="text-2xl">Scan to Clock-in or Clock-out</p>
		</div>
	);
}
