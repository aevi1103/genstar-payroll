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
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

type Props = {
	message?: string;
	error?: string;
};

export function PayrollMessageDialog({ message, error }: Props) {
	const router = useRouter();
	const isOpen = Boolean(message || error);
	const title = error ? "Clocking Issue" : "Clock Update";
	const description = error || message || "";

	const onClick = () => {
		router.push("/payroll");
	};

	return (
		<AlertDialog open={isOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						<Alert variant={error ? "destructive" : "default"}>
							<AlertCircleIcon />
							<AlertTitle>{error ? "Error" : "Success"}</AlertTitle>
							<AlertDescription>{description}</AlertDescription>
						</Alert>
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
