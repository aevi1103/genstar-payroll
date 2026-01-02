"use client";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { getWeekDateRange } from "@/lib/get-week-date-range";
import { shortDateFormat } from "@/lib/utils";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import dayjs from "dayjs";
import { ArrowDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { type ComponentProps } from "react";

export const WeeklyNavFilter = ({
	btnSize = "sm",
}: { btnSize?: ComponentProps<typeof Button>["size"] }) => {
	const params = useSearchParams();
	const router = useRouter();
	const path = usePathname();
	const weekStart = params.get("weekStartDate");
	const weekEnd = params.get("weekEndDate");

	console.log("pathWeeklyNavFilter:", path);

	const onCurrentWeekClick = () => {
		const now = dayjs();
		const { weekStart, weekEnd } = getWeekDateRange(now);

		const searchParams = new URLSearchParams();
		searchParams.set("weekStartDate", dayjs(weekStart).format(shortDateFormat));
		searchParams.set("weekEndDate", dayjs(weekEnd).format(shortDateFormat));

		router.push(`${path}?${searchParams.toString()}`);
	};

	const onPreviousWeekClick = () => {
		const prevWeekStart = dayjs(
			weekStart || dayjs().format(shortDateFormat),
		).subtract(7, "day");

		const { weekStart: newWeekStart, weekEnd: newWeekEnd } =
			getWeekDateRange(prevWeekStart);

		const searchParams = new URLSearchParams();
		searchParams.set(
			"weekStartDate",
			dayjs(newWeekStart).format(shortDateFormat),
		);
		searchParams.set("weekEndDate", dayjs(newWeekEnd).format(shortDateFormat));

		router.push(`${path}?${searchParams.toString()}`);
	};

	const onNextWeekClick = () => {
		const nextWeekStart = dayjs(
			weekStart || dayjs().format(shortDateFormat),
		).add(7, "day");

		const { weekStart: newWeekStart, weekEnd: newWeekEnd } =
			getWeekDateRange(nextWeekStart);

		const searchParams = new URLSearchParams();
		searchParams.set(
			"weekStartDate",
			dayjs(newWeekStart).format(shortDateFormat),
		);
		searchParams.set("weekEndDate", dayjs(newWeekEnd).format(shortDateFormat));

		router.push(`${path}?${searchParams.toString()}`);
	};

	return (
		<div className="flex gap-1">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className="cursor-pointer"
							size={btnSize}
							variant={"default"}
							onClick={onPreviousWeekClick}
						>
							<ChevronLeft />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Previous week</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{weekStart && weekEnd ? (
				<Button size={btnSize} variant={"outline"} disabled>
					{weekStart} - {weekEnd}
				</Button>
			) : (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size={btnSize}
								variant={"outline"}
								onClick={onCurrentWeekClick}
								className="cursor-pointer"
							>
								Current Week
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Set current week</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className="cursor-pointer"
							size={btnSize}
							variant={"default"}
							onClick={onNextWeekClick}
						>
							<ChevronRight />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Next week</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{weekStart && weekEnd && (
				<>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size={btnSize}
									variant={"default"}
									onClick={onCurrentWeekClick}
									className="cursor-pointer"
								>
									<ArrowDown />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Set current week</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size={btnSize}
									variant={"default"}
									onClick={() => {
										router.push(path);
									}}
									className="cursor-pointer"
								>
									<X />
								</Button>
							</TooltipTrigger>

							<TooltipContent>
								<p>Clear filter</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</>
			)}
		</div>
	);
};
