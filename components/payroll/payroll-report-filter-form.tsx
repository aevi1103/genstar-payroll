"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
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
import { cn, shortDateFormat } from "@/lib/utils";

const filterSchema = z
	.object({
		weekStart: z.date({ message: "Week start is required" }),
		weekEnd: z.date({ message: "Week end is required" }),
	})
	.refine((values) => values.weekEnd >= values.weekStart, {
		path: ["weekEnd"],
		message: "Week end must be on or after week start",
	});

type FilterValues = z.infer<typeof filterSchema>;

export const PayrollReportFilterForm = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const searchParamsString = searchParams.toString();

	const parsedInitialDates = useMemo(() => {
		const params = new URLSearchParams(searchParamsString);
		const parseDate = (value: string | null) => {
			if (!value) return undefined;
			const parsed = new Date(value);
			return Number.isNaN(parsed.getTime()) ? undefined : parsed;
		};

		return {
			weekStart: parseDate(params.get("weekStart")),
			weekEnd: parseDate(params.get("weekEnd")),
		};
	}, [searchParamsString]);

	const form = useForm<FilterValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			weekStart: parsedInitialDates.weekStart,
			weekEnd: parsedInitialDates.weekEnd,
		},
	});

	const weekStartValue = parsedInitialDates.weekStart;
	const weekEndValue = parsedInitialDates.weekEnd;

	useEffect(() => {
		form.reset({
			weekStart: weekStartValue,
			weekEnd: weekStartValue
				? dayjs(weekStartValue).endOf("week").toDate()
				: undefined,
		});
	}, [form, weekStartValue]);

	const [weekStartOpen, setWeekStartOpen] = useState(false);
	const watchedWeekStart = useWatch({
		control: form.control,
		name: "weekStart",
	});

	// Auto-calculate weekEnd when weekStart changes
	useEffect(() => {
		if (watchedWeekStart) {
			const endOfWeek = dayjs(watchedWeekStart).endOf("week").toDate();
			form.setValue("weekEnd", endOfWeek);
		}
	}, [watchedWeekStart, form]);

	const onSubmit = (values: FilterValues) => {
		const params = new URLSearchParams(searchParamsString);

		params.set("weekStart", format(values.weekStart, "yyyy-MM-dd"));
		params.set("weekEnd", format(values.weekEnd, "yyyy-MM-dd"));

		const query = params.toString();
		router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-end gap-4"
			>
				<FormField
					control={form.control}
					name="weekStart"
					render={({ field }) => (
						<div className="flex items-center gap-2">
							<FormLabel className="whitespace-nowrap">Week Start:</FormLabel>
							<FormItem>
								<Popover open={weekStartOpen} onOpenChange={setWeekStartOpen}>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													"justify-between text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value
													? format(field.value, "PPP")
													: "Select date"}
												<CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={(date) => {
												if (date) {
													const monday = dayjs(date)
														.startOf("week")
														.add(1, "day")
														.toDate();
													field.onChange(monday);
												}
												setWeekStartOpen(false);
											}}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>

							{watchedWeekStart && (
								<div className="text-sm text-gray-600 flex items-center gap-1">
									<span>Week End:</span>
									<span>
										{format(
											dayjs(watchedWeekStart)
												.endOf("week")
												.format(shortDateFormat),
											"PPP",
										)}
									</span>
								</div>
							)}
						</div>
					)}
				/>

				<Button type="submit">Apply Filters</Button>
			</form>
		</Form>
	);
};
