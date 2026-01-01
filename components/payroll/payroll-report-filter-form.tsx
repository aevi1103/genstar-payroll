"use client";

import { useEffect, useMemo, useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
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
import { cn } from "@/lib/utils";

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

	const form = useForm<FilterValues>({
		resolver: standardSchemaResolver(filterSchema),
		defaultValues: {
			// weekStart: parsedInitialDates.weekStart,
			// weekEnd: parsedInitialDates.weekEnd,
		},
	});

	const [weekStartOpen, setWeekStartOpen] = useState(false);

	return (
		<Form {...form}>
			<form
				// onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-end gap-4"
			>
				<FormField
					control={form.control}
					name="weekStart"
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
											mode={"range"}
											// selected={field.value}
											onSelect={(date) => {
												console.log("Selected date range:", date);
											}}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						</div>
					)}
				/>

				<Button type="submit">Apply Filters</Button>
			</form>
		</Form>
	);
};
