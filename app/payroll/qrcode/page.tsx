"use client";

import { ClockInOutQrCode } from "@/features/qr-code/qr-code";
import { QrCodePdfDownload } from "@/features/qr-code/pdf-qr-code";
import { useEffect, useState } from "react";

export default function QrCode() {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetch("/api/auth/check");
				const data = await res.json();

				if (!data.isActive) {
					window.location.href = `/?error=${encodeURIComponent("Forbidden - inactive employee")}`;
					return;
				}

				if (!data.session) {
					window.location.href = "/auth/login";
					return;
				}

				setIsAuthorized(true);
			} catch (error) {
				console.error("Auth check failed:", error);
				window.location.href = "/auth/login";
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (isLoading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<p className="text-gray-600">Loading...</p>
			</div>
		);
	}

	if (!isAuthorized) {
		return null;
	}

	return (
		<div className="h-full w-full flex flex-col gap-6 justify-center items-center">
			<ClockInOutQrCode />

			<div className="flex flex-col gap-4 items-center">
				<p className="text-gray-600 max-w-md lg:text-lg text-center">
					Use your phone to scan this QR code to clock in or out. You will need
					a valid Genstar account—sign in if prompted—and your administrator
					must approve your account before you can proceed.
				</p>

				<p className="text-yellow-600 max-w-md lg:text-lg text-center">
					Allow GPS location access when prompted to ensure accurate
					timekeeping.
				</p>
			</div>

			<QrCodePdfDownload />
		</div>
	);
}
