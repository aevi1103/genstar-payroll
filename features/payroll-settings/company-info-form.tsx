"use client";

import type { CompanyInfoRecord } from "@/app/payroll/settings/company-info/actions";
import { upsertCompanyInfo } from "@/app/payroll/settings/company-info/actions";
import {
	companyInfoSchema,
	type CompanyInfoFormData,
} from "@/lib/schemas/company-info";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { PlusIcon, Trash2Icon, ChevronDown } from "lucide-react";
import { useCompanyInfoCollapsibleStore } from "@/lib/stores/use-company-info-collapsible-store";

import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const CompanyInfoForm = ({
	initialData,
}: {
	initialData: CompanyInfoRecord | null;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const collapsibleState = useCompanyInfoCollapsibleStore();

	const form = useForm<CompanyInfoFormData>({
		resolver: standardSchemaResolver(
			companyInfoSchema,
		) as Resolver<CompanyInfoFormData>,
		mode: "onChange",
		defaultValues: {
			company_name: initialData?.company_name ?? "",
			main_services: initialData?.main_services ?? "",
			founded_at: initialData?.founded_at
				? new Date(initialData.founded_at)
				: undefined,
			street_address: initialData?.street_address ?? "",
			region_address: initialData?.region_address ?? "",
			city_address: initialData?.city_address ?? "",
			district_address: initialData?.district_address ?? "",
			owner: initialData?.owner ?? "",
			land_line: initialData?.land_line ?? "",
			mobile: initialData?.mobile ?? "",
			email: initialData?.email ?? "",
			long: initialData?.long ?? "",
			lat: initialData?.lat ?? "",
			company_machines:
				initialData?.company_machines?.map((m) => ({
					machine_description: m.machine_description,
				})) ?? [],
			company_other_services:
				initialData?.company_other_services?.map((s) => ({
					service: s.service,
				})) ?? [],
			company_suppliers:
				initialData?.company_suppliers?.map((s) => ({
					supplier: s.supplier,
				})) ?? [],
			company_team:
				initialData?.company_team?.map((t) => ({
					position: t.position,
					description: t.description ?? undefined,
					count: t.count ?? undefined,
				})) ?? [],
			company_what_we_print:
				initialData?.company_what_we_print?.map((w) => ({
					service: w.service,
				})) ?? [],
		},
	});

	// Field arrays for dynamic sections
	const {
		fields: machineFields,
		append: appendMachine,
		remove: removeMachine,
	} = useFieldArray({
		control: form.control,
		name: "company_machines",
	});

	const {
		fields: otherServiceFields,
		append: appendOtherService,
		remove: removeOtherService,
	} = useFieldArray({
		control: form.control,
		name: "company_other_services",
	});

	const {
		fields: supplierFields,
		append: appendSupplier,
		remove: removeSupplier,
	} = useFieldArray({
		control: form.control,
		name: "company_suppliers",
	});

	const {
		fields: teamFields,
		append: appendTeam,
		remove: removeTeam,
	} = useFieldArray({
		control: form.control,
		name: "company_team",
	});

	const {
		fields: printFields,
		append: appendPrint,
		remove: removePrint,
	} = useFieldArray({
		control: form.control,
		name: "company_what_we_print",
	});

	const onSubmit = async (data: CompanyInfoFormData) => {
		setIsLoading(true);
		try {
			const result = await upsertCompanyInfo(data);

			if (result.success) {
				toast.success("Company information saved successfully");
			} else {
				toast.error(result.error || "Failed to save company information");
				if ("errors" in result) {
					console.error("Validation errors:", result.errors);
				}
			}
		} catch (error) {
			console.error("Error submitting company info:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col h-full"
			>
				<div className="flex-1 overflow-y-auto p-4 lg:p-6 lg:space-y-6 space-y-4">
					{/* Company Overview */}
					<Collapsible
						open={collapsibleState.companyOverview}
						onOpenChange={(open) =>
							collapsibleState.setSection("companyOverview", open)
						}
						className="space-y-4"
					>
						<CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border bg-card lg:p-4 p-2 text-left hover:bg-accent transition-colors">
							<div>
								<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
									Company Overview
								</h3>
								<p className="text-sm text-muted-foreground">
									Basic information about your company
								</p>
							</div>
							<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
						</CollapsibleTrigger>
						<CollapsibleContent className="space-y-4">
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="company_name"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Company Name</FormLabel>
											<FormControl>
												<Input placeholder="Acme Corporation" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="main_services"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Main Services</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe your main services..."
													className="min-h-20"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Brief description of your core services
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="founded_at"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Founded Date</FormLabel>
											<FormControl>
												<Input
													type="date"
													{...field}
													value={
														field.value
															? new Date(field.value)
																	.toISOString()
																	.split("T")[0]
															: ""
													}
													onChange={(e) => {
														const date = e.target.value
															? new Date(e.target.value)
															: undefined;
														field.onChange(date);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Address */}
					<Collapsible
						open={collapsibleState.address}
						onOpenChange={(open) =>
							collapsibleState.setSection("address", open)
						}
						className="space-y-4"
					>
						<CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border bg-card lg:p-4 p-2 text-left hover:bg-accent transition-colors">
							<div>
								<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
									Address
								</h3>
								<p className="text-sm text-muted-foreground">
									Primary business address details
								</p>
							</div>
							<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
						</CollapsibleTrigger>
						<CollapsibleContent className="space-y-4">
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="street_address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Street Address</FormLabel>
											<FormControl>
												<Input placeholder="123 Main St" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="district_address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>District/Barangay</FormLabel>
											<FormControl>
												<Input placeholder="Barangay 123" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="city_address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City / Municipality</FormLabel>
											<FormControl>
												<Input placeholder="Quezon City" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="region_address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Province / Region</FormLabel>
											<FormControl>
												<Input placeholder="Metro Manila" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Contact & Owner */}
					<Collapsible
						open={collapsibleState.contactOwner}
						onOpenChange={(open) =>
							collapsibleState.setSection("contactOwner", open)
						}
						className="space-y-4"
					>
						<CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border bg-card lg:p-4 p-2 text-left hover:bg-accent transition-colors">
							<div>
								<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
									Contact & Owner
								</h3>
								<p className="text-sm text-muted-foreground">
									Contact details for billing and payroll correspondence
								</p>
							</div>
							<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
						</CollapsibleTrigger>
						<CollapsibleContent className="space-y-4">
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="owner"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Owner / Representative</FormLabel>
											<FormControl>
												<Input placeholder="Full name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="name@company.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="mobile"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mobile</FormLabel>
											<FormControl>
												<Input placeholder="09xxxxxxxxx" {...field} />
											</FormControl>
											<FormDescription>
												Include country code if applicable
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="land_line"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Landline</FormLabel>
											<FormControl>
												<Input placeholder="(02) 123-4567" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Geolocation */}
					<Collapsible
						open={collapsibleState.geolocation}
						onOpenChange={(open) =>
							collapsibleState.setSection("geolocation", open)
						}
						className="space-y-4"
					>
						<CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border bg-card lg:p-4 p-2 text-left hover:bg-accent transition-colors">
							<div>
								<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
									Geolocation
								</h3>
								<p className="text-sm text-muted-foreground">
									Optional coordinates for site location
								</p>
							</div>
							<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
						</CollapsibleTrigger>
						<CollapsibleContent className="space-y-4">
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="lat"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Latitude</FormLabel>
											<FormControl>
												<Input
													type="text"
													inputMode="decimal"
													placeholder="14.5995"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="long"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Longitude</FormLabel>
											<FormControl>
												<Input
													type="text"
													inputMode="decimal"
													placeholder="120.9842"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Company Machines */}
					<Collapsible
						open={collapsibleState.machines}
						onOpenChange={(open) =>
							collapsibleState.setSection("machines", open)
						}
						className="space-y-4 "
					>
						<div className="flex items-center gap-3 rounded-lg border bg-card lg:p-4 p-2 hover:bg-accent transition-colors">
							<CollapsibleTrigger className="group flex flex-1 items-center text-left hover:opacity-80 transition-opacity">
								<div>
									<h3 className="text-lg font-semibold">
										Machines & Equipment
									</h3>
									<p className="text-sm text-muted-foreground">
										List of machines available
									</p>
								</div>
							</CollapsibleTrigger>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendMachine({ machine_description: "" })}
							>
								<PlusIcon className="h-4 w-4 mr-2" />
								Add Machine
							</Button>
							<CollapsibleTrigger className="group">
								<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
							</CollapsibleTrigger>
						</div>

						<CollapsibleContent className="space-y-4 pt-4">
							<div className="space-y-3">
								{machineFields.map((field, index) => (
									<div key={field.id} className="flex gap-3">
										<FormField
											control={form.control}
											name={`company_machines.${index}.machine_description`}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input
															placeholder="Machine description"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removeMachine(index)}
										>
											<Trash2Icon className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								{machineFields.length === 0 && (
									<p className="text-sm text-muted-foreground italic">
										No machines added yet
									</p>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Other Services */}
					<Collapsible
						open={collapsibleState.otherServices}
						onOpenChange={(open) =>
							collapsibleState.setSection("otherServices", open)
						}
						className="space-y-4"
					>
						<div className="flex items-center gap-3 rounded-lg border bg-card lg:p-4 p-2 hover:bg-accent transition-colors">
							<CollapsibleTrigger className="group flex flex-1 items-center text-left hover:opacity-80 transition-opacity">
								<div>
									<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
										Other Services
									</h3>
									<p className="text-sm text-muted-foreground">
										Additional services offered
									</p>
								</div>
							</CollapsibleTrigger>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendOtherService({ service: "" })}
							>
								<PlusIcon className="h-4 w-4 mr-2" />
								Add Service
							</Button>
							<CollapsibleTrigger className="group">
								<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
							</CollapsibleTrigger>
						</div>

						<CollapsibleContent className="space-y-4 pt-4">
							<div className="space-y-3">
								{otherServiceFields.map((field, index) => (
									<div key={field.id} className="flex gap-3">
										<FormField
											control={form.control}
											name={`company_other_services.${index}.service`}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input placeholder="Service name" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removeOtherService(index)}
										>
											<Trash2Icon className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								{otherServiceFields.length === 0 && (
									<p className="text-sm text-muted-foreground italic">
										No services added yet
									</p>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Suppliers */}
					<Collapsible
						open={collapsibleState.suppliers}
						onOpenChange={(open) =>
							collapsibleState.setSection("suppliers", open)
						}
						className="space-y-4"
					>
						<div className="flex items-center gap-3 rounded-lg border bg-card lg:p-4 p-2 hover:bg-accent transition-colors">
							<CollapsibleTrigger className="group flex flex-1 items-center text-left hover:opacity-80 transition-opacity">
								<div>
									<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
										Suppliers
									</h3>
									<p className="text-sm text-muted-foreground">
										Your key suppliers
									</p>
								</div>
							</CollapsibleTrigger>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendSupplier({ supplier: "" })}
							>
								<PlusIcon className="h-4 w-4 mr-2" />
								Add Supplier
							</Button>
							<CollapsibleTrigger className="group">
								<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
							</CollapsibleTrigger>
						</div>

						<CollapsibleContent className="space-y-4 pt-4">
							<div className="space-y-3">
								{supplierFields.map((field, index) => (
									<div key={field.id} className="flex gap-3">
										<FormField
											control={form.control}
											name={`company_suppliers.${index}.supplier`}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input placeholder="Supplier name" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removeSupplier(index)}
										>
											<Trash2Icon className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								{supplierFields.length === 0 && (
									<p className="text-sm text-muted-foreground italic">
										No supplier added yet
									</p>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* Team Positions */}
					<Collapsible
						open={collapsibleState.teamPositions}
						onOpenChange={(open) =>
							collapsibleState.setSection("teamPositions", open)
						}
						className="space-y-4"
					>
						<div className="flex items-center gap-3 rounded-lg border bg-card lg:p-4 p-2 hover:bg-accent transition-colors">
							<CollapsibleTrigger className="group flex flex-1 items-center text-left hover:opacity-80 transition-opacity">
								<div>
									<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
										Team Positions
									</h3>
									<p className="text-sm text-muted-foreground">
										Organizational structure
									</p>
								</div>
							</CollapsibleTrigger>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									appendTeam({
										position: "",
										description: "",
										count: undefined,
									})
								}
							>
								<PlusIcon className="h-4 w-4 mr-2" />
								Add Position
							</Button>
							<CollapsibleTrigger className="group">
								<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
							</CollapsibleTrigger>
						</div>

						<CollapsibleContent className="space-y-4 pt-4">
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
								{teamFields.map((field, index) => (
									<div
										key={field.id}
										className="rounded-lg border p-4 space-y-3"
									>
										<div className="relative flex items-start gap-3">
											<div className="flex-1 flex gap-3 flex-wrap">
												<FormField
													control={form.control}
													name={`company_team.${index}.position`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Position</FormLabel>
															<FormControl>
																<Input placeholder="Manager" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`company_team.${index}.count`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Count</FormLabel>
															<FormControl>
																<Input
																	type="number"
																	placeholder="2"
																	{...field}
																	value={field.value ?? ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => removeTeam(index)}
												className="absolute -top-3 -right-6  mr-2"
											>
												<Trash2Icon className="h-4 w-4 text-destructive" />
											</Button>
										</div>
										<FormField
											control={form.control}
											name={`company_team.${index}.description`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Role description..."
															{...field}
															value={field.value ?? ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								))}
								{teamFields.length === 0 && (
									<p className="text-sm text-muted-foreground italic">
										No positions added yet
									</p>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>

					{/* What We Print */}
					<Collapsible
						open={collapsibleState.whatWePrint}
						onOpenChange={(open) =>
							collapsibleState.setSection("whatWePrint", open)
						}
						className="space-y-4"
					>
						<div className="flex items-center gap-3 rounded-lg border bg-card lg:p-4 p-2 hover:bg-accent transition-colors">
							<CollapsibleTrigger className="group flex flex-1 items-center text-left hover:opacity-80 transition-opacity">
								<div>
									<h3 className="text-lg font-semibold group-data-[state=open]:text-primary transition-colors">
										What We Print
									</h3>
									<p className="text-sm text-muted-foreground">
										Types of printing services
									</p>
								</div>
							</CollapsibleTrigger>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendPrint({ service: "" })}
							>
								<PlusIcon className="h-4 w-4 mr-2" />
								Add Print Service
							</Button>
							<CollapsibleTrigger className="group">
								<ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
							</CollapsibleTrigger>
						</div>

						<CollapsibleContent className="space-y-4 pt-4">
							<div className="space-y-3">
								{printFields.map((field, index) => (
									<div key={field.id} className="flex gap-3">
										<FormField
											control={form.control}
											name={`company_what_we_print.${index}.service`}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input
															placeholder="Print service type"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removePrint(index)}
										>
											<Trash2Icon className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								{printFields.length === 0 && (
									<p className="text-sm text-muted-foreground italic">
										No print services added yet
									</p>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>
				</div>

				{/* Sticky Save Button */}
				<div className="shrink-0 border-t bg-background p-4 shadow-lg">
					<Button
						type="submit"
						disabled={isLoading}
						size="lg"
						onClick={form.handleSubmit(onSubmit)}
					>
						{isLoading ? "Saving..." : "Save Company Info"}
					</Button>
				</div>
			</form>
		</Form>
	);
};
