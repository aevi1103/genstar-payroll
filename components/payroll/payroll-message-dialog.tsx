"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	message?: string;
	error?: string;
};

export function PayrollMessageDialog({ message, error }: Props) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	const isOpen = open && Boolean(message || error);

	const clearQueryParams = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("message");
		params.delete("error");

		const query = params.toString();
		const nextUrl = query ? `/payroll?${query}` : "/payroll";

		router.replace(nextUrl, { scroll: false });
		setOpen(false);
	};

	const title = error ? "Clocking issue" : "Clock update";
	const description = error || message || "";

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={(nextOpen: any) => {
				if (!nextOpen) {
					clearQueryParams();
					return;
				}
				setOpen(true);
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description ? (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					) : null}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={clearQueryParams}
						className={cn(
							"min-w-[120px]",
							buttonVariants({ variant: error ? "destructive" : "default" }),
						)}
					>
						Ok
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
