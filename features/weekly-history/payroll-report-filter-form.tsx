"use client";

import { useEffect, useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CalendarIcon, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePayrollHistoryQuery } from "@/hooks/use-payroll-history-query";
import { Spinner } from "@/components/ui/spinner";

const filterSchema = z.object({
	dateRange: z
		.object({
			from: z.date().optional(),
			to: z.date().optional(),
		})
		.refine((data) => data.from && data.to, {
			message: "Please select both start and end dates",
		}),
});

type FilterValues = z.infer<typeof filterSchema>;

export const PayrollReportFilterForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const startDate = searchParams.get("weekStartDate");
	const endDate = searchParams.get("weekEndDate");

	const { isLoading } = usePayrollHistoryQuery({
		weekStartDate: startDate || undefined,
		weekEndDate: endDate || undefined,
	});

	const [weekStartOpen, setWeekStartOpen] = useState(false);

	const form = useForm<FilterValues>({
		resolver: standardSchemaResolver(filterSchema),
		defaultValues: {
			dateRange: {
				from: undefined,
				to: undefined,
			},
		},
	});

	useEffect(() => {
		if (startDate && endDate) {
			const fromDate = dayjs(startDate).toDate();
			const toDate = dayjs(endDate).toDate();

			form.setValue("dateRange", { from: fromDate, to: toDate });
		}
	}, [startDate, endDate, form]);

	const onSubmit = (values: FilterValues) => {
		const params = new URLSearchParams(searchParams);

		if (values.dateRange.from && values.dateRange.to) {
			const weekStart = dayjs(values.dateRange.from)
				.startOf("week")
				.add(1, "day")
				.toDate();

			const weekEnd = dayjs(values.dateRange.to)
				.endOf("week")
				.startOf("day")
				.toDate();

			params.set("weekStartDate", dayjs(weekStart).format("YYYY-MM-DD"));
			params.set("weekEndDate", dayjs(weekEnd).format("YYYY-MM-DD"));

			router.push(`?${params.toString()}`);
			setWeekStartOpen(false);

			form.setValue("dateRange", { from: weekStart, to: weekEnd });
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-end gap-2 flex-wrap "
			>
				<FormField
					control={form.control}
					name="dateRange"
					render={({ field }) => (
						<div className="flex items-center gap-2">
							<FormLabel className="whitespace-nowrap">Week Range:</FormLabel>
							<FormItem>
								<Popover open={weekStartOpen} onOpenChange={setWeekStartOpen}>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													"justify-between text-left font-normal min-w-70",
													!field.value?.from && "text-muted-foreground",
												)}
											>
												{field.value?.from && field.value?.to
													? `${dayjs(field.value.from).format("MMM DD, YYYY")} - ${dayjs(
															field.value.to,
														).format("MMM DD, YYYY")}`
													: "Select date range"}
												<CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="range"
											selected={{
												from: field.value?.from,
												to: field.value?.to,
											}}
											onSelect={(date) => {
												field.onChange(date);
											}}
											numberOfMonths={2}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						</div>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? (
						<div className="flex gap-2">
							<Spinner />
							Loading...
						</div>
					) : (
						<Send />
					)}
				</Button>
			</form>
		</Form>
	);
};
