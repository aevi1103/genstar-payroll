"use client";
import { useIsClient } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { QRCode } from "../../components/ui/shadcn-io/qr-code";

export const ClockInOutQrCode = () => {
	const isClient = useIsClient();

	const [url] = useState<string | null>(() => {
		if (typeof window === "undefined") return null;
		return new URL("/payroll/entry", window.location.origin).toString();
	});

	if (!isClient) return null;

	if (!isClient) return null;

	if (!url) return null;

	return (
		<QRCode
			className="w-full px-6 sm:size-10/12 md:size-1/2 md:px-0"
			data={url}
		/>
	);
};
