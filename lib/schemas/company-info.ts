import { z } from "zod";

const addressField = z
	.string()
	.trim()
	.max(255, "Must be 255 characters or less")
	.optional();
const contactField = z
	.string()
	.trim()
	.max(100, "Must be 100 characters or less")
	.optional();

// Related data schemas
export const companyMachineSchema = z.object({
	machine_description: z
		.string()
		.trim()
		.min(1, "Machine description is required")
		.max(255),
});

export const companyOtherServiceSchema = z.object({
	service: z.string().trim().min(1, "Service is required").max(255),
});

export const companySupplierSchema = z.object({
	supplier: z.string().trim().min(1, "Supplier is required").max(255),
});

export const companyTeamSchema = z.object({
	position: z.string().trim().min(1, "Position is required").max(255),
	description: z.string().trim().max(255).optional().nullable(),
	count: z.coerce.number().int().positive().optional().nullable(),
});

export const companyWhatWePrintSchema = z.object({
	service: z.string().trim().min(1, "Service is required").max(255),
});

export const companyInfoSchema = z.object({
	company_name: z.string().trim().max(255).optional(),
	main_services: z.string().trim().max(500).optional(),
	founded_at: z.coerce.date().nullish(),
	street_address: addressField,
	region_address: addressField,
	city_address: addressField,
	district_address: addressField,
	owner: contactField,
	land_line: contactField,
	mobile: contactField,
	email: z
		.email("Invalid email address")
		.trim()
		.max(255, "Email must be 255 characters or less")
		.optional()
		.or(z.literal("")),
	long: z.string().max(100, "Must be 100 characters or less").optional(),
	lat: z.string().max(100, "Must be 100 characters or less").optional(),
	company_machines: z.array(companyMachineSchema).optional(),
	company_other_services: z.array(companyOtherServiceSchema).optional(),
	company_suppliers: z.array(companySupplierSchema).optional(),
	company_team: z.array(companyTeamSchema).optional(),
	company_what_we_print: z.array(companyWhatWePrintSchema).optional(),
});

export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
export type CompanyMachine = z.infer<typeof companyMachineSchema>;
export type CompanyOtherService = z.infer<typeof companyOtherServiceSchema>;
export type CompanySupplier = z.infer<typeof companySupplierSchema>;
export type CompanyTeam = z.infer<typeof companyTeamSchema>;
export type CompanyWhatWePrint = z.infer<typeof companyWhatWePrintSchema>;
