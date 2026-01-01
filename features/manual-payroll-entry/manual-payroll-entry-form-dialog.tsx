"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useManualPayrollDialogStore } from "@/lib/stores/manual-payroll-dialog-store";
import {
	manualPayrollEntrySchema,
	type ManualPayrollEntryFormData,
} from "@/lib/schemas/manual-payroll-entry";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import type { Users } from "@/app/api/payroll/users/route";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { shortDateFormat } from "@/lib/utils";
import Link from "next/link";

// Helper to format date to ISO string for API
function formatDateToISOString(date: Date, timeInput: string): string {
	const dateOnly = dayjs(date).format(shortDateFormat);
	const dateStr = `${dateOnly} ${timeInput}`;
	console.log("Formatting date string:", dateStr);
	return dayjs(dateStr, "MM/DD/YYYY HH:mm:ss").toISOString();
}

export function ManualPayrollEntryFormDialog() {
	const { isOpen, closeDialog, setPayrollEntryData, payrollEntryData } =
		useManualPayrollDialogStore(
			useShallow((state) => ({
				isOpen: state.isOpen,
				closeDialog: state.closeDialog,
				setPayrollEntryData: state.setPayrollEntryData,
				payrollEntryData: state.payrollEntryData,
			})),
		);

	const queryClient = useQueryClient();
	const [clockInDate, setClockInDate] = useState<Date | undefined>(new Date());
	const [clockOutDate, setClockOutDate] = useState<Date | undefined>(undefined);
	const [clockInOpen, setClockInOpen] = useState(false);
	const [clockOutOpen, setClockOutOpen] = useState(false);

	const form = useForm<ManualPayrollEntryFormData>({
		resolver: standardSchemaResolver(manualPayrollEntrySchema),
		mode: "onChange",
		defaultValues: {
			userId: "",
			clockInTime: dayjs().hour(8).minute(0).second(0).format("HH:mm:ss"),
			clockOutTime: "",
			clockInLatitude: undefined,
			clockInLongitude: undefined,
			clockOutLatitude: undefined,
			clockOutLongitude: undefined,
		},
	});

	useEffect(() => {
		if (payrollEntryData) {
			const clockIn = dayjs(payrollEntryData.clock_in_time)
				.toDate()
				.toLocaleString()
				.replace(",", "");

			const clockOut = payrollEntryData.clock_out_time
				? dayjs(payrollEntryData.clock_out_time)
						.toDate()
						.toLocaleString()
						.replace(",", "")
				: "";

			const clockInDateOnly = payrollEntryData.clock_in_date
				? dayjs(clockIn).format(shortDateFormat)
				: undefined;

			const clockOutDateOnly = payrollEntryData.clock_out_date
				? dayjs(clockOut).format(shortDateFormat)
				: clockInDateOnly; // Default to clock-in date if no clock-out date

			// If editing existing entry, populate form with existing data
			form.reset({
				userId: payrollEntryData.user_id || "",
				clockInTime: dayjs(clockIn).format("HH:mm:ss").toString(),
				clockOutTime: payrollEntryData.clock_out_time
					? dayjs(clockOut).format("HH:mm:ss").toString()
					: "17:00:00", // Default to 5pm if no clock-out time
			});
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setClockInDate(
				payrollEntryData.clock_in_date
					? dayjs(clockInDateOnly).toDate()
					: undefined,
			);
			setClockOutDate(
				clockOutDateOnly ? dayjs(clockOutDateOnly).toDate() : undefined,
			);
		}
	}, [form, payrollEntryData]);

	// Fetch users from API
	const {
		data: usersData,
		isLoading: isLoadingUsers,
		error: usersError,
	} = useQuery({
		queryKey: ["payroll-users"],
		queryFn: async () => {
			const response = await fetch("/api/payroll/users");
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch users");
			}
			return response.json() as unknown as Users;
		},
		enabled: isOpen,
	});

	// Create payroll entry mutation via API
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: ManualPayrollEntryFormData) => {
			const response = await fetch("/api/payroll/manual-entry", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create payroll entry");
			}

			return response.json();
		},
		onSuccess: () => {
			toast.success("Payroll entry created successfully");
			form.reset();
			closeDialog();
			// Invalidate the payroll history query to refetch data
			queryClient.invalidateQueries({ queryKey: ["payroll-history"] });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to create payroll entry",
			);
		},
	});

	const onSubmit = async (data: ManualPayrollEntryFormData) => {
		if (!clockInDate) {
			toast.error("Clock in date is required");
			return;
		}

		const clockInISO = formatDateToISOString(clockInDate, data.clockInTime);
		let clockOutISO: string | null = null;

		// Only validate clock out if it's provided
		if (clockOutDate && data.clockOutTime) {
			clockOutISO = formatDateToISOString(clockOutDate, data.clockOutTime);

			console.log("Clock In ISO:", {
				data,
				clockOutDate,
				clockOutISO,
			});

			// Validate that clock out is after clock in
			if (new Date(clockOutISO) <= new Date(clockInISO)) {
				toast.error("Clock out time must be after clock in time");
				return;
			}
		}

		// Capture current GPS location
		let latitude: number | undefined;
		let longitude: number | undefined;

		if (navigator.geolocation) {
			try {
				const position = await new Promise<GeolocationPosition>(
					(resolve, reject) => {
						navigator.geolocation.getCurrentPosition(resolve, reject);
					},
				);
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
			} catch (error) {
				console.log("GPS location not available:", error);
				// Continue without GPS data
			}
		}

		await mutateAsync({
			userId: data.userId,
			clockInTime: clockInISO,
			clockOutTime: clockOutISO || "",
			clockInLatitude: latitude,
			clockInLongitude: longitude,
			clockOutLatitude: clockOutISO ? latitude : undefined,
			clockOutLongitude: clockOutISO ? longitude : undefined,
		});

		closeDialog();
		setPayrollEntryData(null);
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					closeDialog();
					setPayrollEntryData(null);
				}
			}}
		>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>
						{payrollEntryData ? "Edit Payroll Entry" : "Create Payroll Entry"}
					</DialogTitle>
					<DialogDescription className="space-y-2">
						<p>
							{payrollEntryData
								? "Edit an existing payroll entry for an employee."
								: "Create a payroll entry for an employee."}
						</p>

						<p>
							Manual payroll entries should be used sparingly and only for
							exceptional cases. Regular clock-ins and clock-outs should be done
							through the{" "}
							<Link
								className="text-blue-500 underline"
								href={"/payroll/qrcode"}
							>
								QR code
							</Link>{" "}
							system to ensure accurate time tracking, and will automatically
							adjust time for late and early clock-ins clock-ins
						</p>
					</DialogDescription>
				</DialogHeader>

				{usersError && (
					<div className="text-red-500 text-sm p-3 bg-red-50 rounded">
						Failed to load users: {usersError.message}
					</div>
				)}

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* User Selection */}
						<FormField
							control={form.control}
							name="userId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Employee</FormLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isLoadingUsers}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select an employee" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{isLoadingUsers ? (
												<div className="flex justify-center p-2">
													<Spinner className="h-4 w-4" />
												</div>
											) : (usersData?.length || 0) > 0 ? (
												usersData?.map((user) => (
													<SelectItem key={user.id} value={user.id}>
														{user.first_name && user.last_name
															? `${user.first_name} ${user.last_name} (${user.email})`
															: user.email}
													</SelectItem>
												))
											) : (
												<div className="text-sm text-muted-foreground p-2">
													No users available
												</div>
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Clock In Time */}
						<div className="space-y-4">
							<div className="space-y-2">
								<FormLabel>Clock In Time</FormLabel>
								<div className="flex gap-3 w-full">
									{/* Clock In Date */}
									<Popover open={clockInOpen} onOpenChange={setClockInOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={`flex-1 justify-between font-normal ${
													!clockInDate ? "border-red-500" : ""
												}`}
												disabled={isPending}
											>
												{clockInDate
													? format(clockInDate, "MMM d, yyyy")
													: "Select date"}
												<ChevronDownIcon className="h-4 w-4" />
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto overflow-hidden p-0"
											align="start"
										>
											<Calendar
												mode="single"
												selected={clockInDate}
												onSelect={(date) => {
													setClockInDate(date);
													setClockInOpen(false);
												}}
												disabled={(date) => date > new Date()}
											/>
										</PopoverContent>
									</Popover>

									{/* Clock In Time Input */}
									<FormField
										control={form.control}
										name="clockInTime"
										render={({ field }) => (
											<Input
												{...field}
												type="time"
												step="1"
												disabled={isPending}
												className="flex-1"
											/>
										)}
									/>
								</div>
							</div>

							{!clockInDate && (
								<p className="text-sm font-medium text-red-500">
									Clock in date is required
								</p>
							)}

							{payrollEntryData && (
								<div className="space-y-2">
									<FormLabel>Clock Out Time</FormLabel>
									<div className="flex gap-3 w-full">
										{/* Clock Out Date */}
										<Popover open={clockOutOpen} onOpenChange={setClockOutOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="flex-1 justify-between font-normal"
													disabled={isPending}
												>
													{clockOutDate
														? format(clockOutDate, "MMM d, yyyy")
														: "Select date"}
													<ChevronDownIcon className="h-4 w-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto overflow-hidden p-0"
												align="start"
											>
												<Calendar
													mode="single"
													selected={clockOutDate}
													onSelect={(date) => {
														setClockOutDate(date);
														setClockOutOpen(false);
													}}
													disabled={(date) =>
														clockInDate ? date < clockInDate : false
													}
												/>
											</PopoverContent>
										</Popover>

										{/* Clock Out Time Input */}
										<FormField
											control={form.control}
											name="clockOutTime"
											render={({ field }) => (
												<Input
													{...field}
													type="time"
													step="1"
													disabled={isPending}
													className="flex-1"
												/>
											)}
										/>

										{/* Clear Clock Out Button */}
										{clockOutDate && (
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => {
													setClockOutDate(undefined);
													form.setValue("clockOutTime", "");
												}}
												disabled={isPending}
												title="Clear clock out"
											>
												<XIcon className="h-4 w-4" />
											</Button>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Form Actions */}
						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={closeDialog}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending || isLoadingUsers}>
								{isPending ? (
									<>
										<Spinner className="mr-2 h-4 w-4" />
										Submitting...
									</>
								) : payrollEntryData ? (
									"Edit Entry"
								) : (
									"Create Entry"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
