"use client";

import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
	message?: string;
	error?: string;
	time?: string;
};

export function PayrollMessageDialog({ message, error, time }: Props) {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const [countdown, setCountdown] = useState(0);

	const closeDuration = error ? 10000 : 5000;
	const totalSeconds = Math.ceil(closeDuration / 1000);

	useEffect(() => {
		if (message || error) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsOpen(true);
			setCountdown(totalSeconds);
		}
	}, [message, error, totalSeconds]);

	useEffect(() => {
		if (!isOpen || countdown < 0) return;

		if (countdown === 0) {
			// eslint-disable-next-line react-hooks/immutability
			onClick();
			return;
		}

		const interval = setInterval(() => {
			setCountdown((prev) => Math.max(-1, prev - 1));
		}, 1000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, countdown]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (message) {
				setIsOpen(false);
				router.push("/payroll");
			}
		}, closeDuration);

		return () => clearTimeout(timeoutId);
	}, [message, closeDuration, router]);

	const description = error || message || "";

	const onClick = () => {
		router.push("/payroll");
		setIsOpen(false);
	};

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					onClick();
				} else {
					setIsOpen(true);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-start justify-between gap-4">
						<AlertDialogTitle>
							Clock-in Status: {error ? "Error" : "Success"}
						</AlertDialogTitle>
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0">
							<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
								{countdown}s
							</span>
						</div>
					</div>
					<AlertDialogDescription
						className={cn(
							error ? "text-red-600 font-bold" : "text-green-600",
							"lg:text-lg",
						)}
					>
						{description} {time ? `at ${new Date(time).toLocaleString()}` : ""}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClick}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
