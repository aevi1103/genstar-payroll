"use server";
import { cacheTag } from "next/cache";
import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import parsePhoneNumber from "libphonenumber-js";
import { serializeData } from "@/lib/utils";

const getCompanyInfoData = async () => {
	"use cache";
	cacheTag("company-info");

	const record = await prisma.company_info.findFirst({
		include: {
			company_machines: {
				orderBy: { created_at: "desc" },
			},
			company_other_services: {
				orderBy: { created_at: "desc" },
			},
			company_suppliers: {
				orderBy: { created_at: "desc" },
			},
			company_team: {
				orderBy: { created_at: "desc" },
			},
			company_what_we_print: {
				orderBy: { created_at: "desc" },
			},
		},
	});

	// Serialize BigInt values to prevent JSON serialization errors
	return serializeData(record);
};

export const getCompanyInfo = async () => {
	const record = await getCompanyInfoData();

	const streetAddress =
		record?.street_address ??
		"#97 General Avenue Near Corner Tandang Sora Avenue";
	const cityAddress = record?.city_address ?? "Project 8 Quezon City";
	const regionAddress = record?.region_address ?? null;
	const districtAddress = record?.district_address ?? null;

	const owner = record?.owner ?? "Mr. Renato D. Reformina";

	const landLine = record?.land_line ?? "8929-4482";
	const mobile = record?.mobile ?? "09157365273";

	const email = record?.email ?? "genstarprints@gmail.com";
	const long = record?.long ?? "14.678685";
	const lat = record?.lat ?? "121.025716";

	const fullAddressArr = [
		streetAddress,
		cityAddress,
		regionAddress,
		districtAddress,
	].filter((line): line is string => line !== null && line.trim() !== "");

	const fullAddress = fullAddressArr.join(", ");

	const companyMachines =
		record?.company_machines?.map((m) => m.machine_description)?.sort() ?? [];

	const companyOtherServices =
		record?.company_other_services?.map((s) => s.service)?.sort() ?? [];

	const companySuppliers =
		record?.company_suppliers?.map((s) => s.supplier)?.sort() ?? [];

	const companyTeam =
		record?.company_team
			?.map((t) =>
				`${(t.count || 0) > 1 ? `${t.count} - ` : ""}${t.position}${t.description ? ` - ${t.description}` : ""}`.trim(),
			)
			?.sort() ?? [];

	const companyWhatWePrint =
		record?.company_what_we_print?.map((w) => w.service)?.sort() ?? [];

	return {
		dateOfCreation: record?.founded_at
			? dayjs(record.founded_at).year().toString()
			: "2007",
		mainServices:
			record?.main_services ??
			"Offset Printing, Digital Printing, Large Format Printing, Signages",
		companyName: record?.company_name ?? "Genstar Printing Services",
		streetAddress,
		regionAddress,
		cityAddress,
		districtAddress,
		fullAddress,
		addressLines: fullAddressArr,
		owner,
		landLine,
		mobile: parsePhoneNumber(mobile, "PH")?.formatInternational() ?? mobile,
		email,
		long,
		lat,
		geoLocation: `${lat},${long}`,
		companyMachines,
		companyOtherServices,
		companySuppliers,
		companyTeam,
		companyWhatWePrint,
	};
};

export type CompanyInfo = Prisma.PromiseReturnType<typeof getCompanyInfo>;
