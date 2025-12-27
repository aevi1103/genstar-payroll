"use client";

import type React from "react";

export const COMPANY_INFO = {
	businessName: "Genstar Printing Services",
	addressLines: [
		"#97 General Avenue Near Corner Tandang Sora Avenue",
		"Project 8 Quezon City",
	],
	phones: [
		{ label: "Landline", value: "89294482" },
		{ label: "Mobile Landline", value: "85426284" },
		{ label: "Cell", value: "09157365273" },
		{ label: "Cell", value: "09103082519" },
	],
	ownerManager: "Mr. Renato D. Reformina",
	residenceAddress:
		"B6 L27 Pine St. Hillcrest Townhomes, North Olympus Subd., Zabarte Road, Novaliches, Quezon City",
	emails: ["genstarprints@yahoo.com", "genstarprints@gmail.com"],
};

export const BUSINESS_DETAILS = {
	dateOfCreation: "March 19, 2007",
	mainServices: "Printing Services",
};

export const HUMAN_RESOURCES: { role: string; count: number }[] = [
	{ role: "Office Manager", count: 1 },
	{ role: "Secretary / Liaison Officer", count: 1 },
	{ role: "Graphic Artist", count: 1 },
	{ role: "Operators - for 1 color Heidelberg KORS Offset Machine", count: 2 },
	{
		role: "Operators - for 2 Colors Offset Machine Heidelberg SORKZ",
		count: 2,
	},
	{
		role: "Operators - for GTO 52 Offset Machine and with numbering",
		count: 2,
	},
	{ role: "Cutter Operators", count: 2 },
	{ role: "Bindery Section Staffs", count: 6 },
];

export const MACHINES: string[] = [
	"2 units Heidelberg Sorkz 2 colors offset machine",
	"2 units Heidelberg Kors 20 x 29 offset machine",
	"2 units Heidelberg GTO 52 offset machine with numbering",
	"2 units Cutting Machine",
	"1 unit UV Lamination Machine",
	"1 unit Horizon 4 stations Perfect Binding Machine",
	"1 unit Minerva Numbering Machine",
	"1 unit Smyth Sewn Machine",
	"1 unit Folding Machine",
	"1 unit Stitching Machine",
	"3 units Sewing Machines",
	"2 units Computers",
];

export const SERVICES_WE_PRINT: string[] = [
	"Souvenir Program",
	"Magazine",
	"Brochure",
	"Flyer",
	"Box and Label",
	"Poster",
	"Campaign Paraphernalia",
	"Calendar",
	"Newsletter",
	"Books",
	"Journal",
	"Forms",
	"Business Card",
	"Postcard",
	"Stickers",
	"Leaflets",
];

export const SERVICES_WE_OFFER: string[] = [
	"Offset Running",
	"Numbering",
	"Perfect Binding",
	"Cutting",
	"Layouting",
	"Graphic Design",
];

export const MAJOR_SUPPLIERS: string[] = [
	"NAPPCO Paper Philippines",
	"Starpaper",
	"MJB Paper",
	"TOYO Ink International",
	"Graphica",
	"Belo CTP and printing",
];

export function ServicesSection(): React.ReactElement {
	return (
		<section
			id="services"
			className="relative z-10 mx-auto max-w-6xl px-6 pb-24"
		>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
						Services & Company Information
					</p>
					<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
						What we offer and our capacity
					</h2>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{/* General Business Information */}
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						General Business Information
					</h3>
					<div className="mt-3 space-y-2 text-sm text-emerald-900/85">
						<p>
							<span className="font-semibold">Business Name:</span>{" "}
							{COMPANY_INFO.businessName}
						</p>
						<div>
							<p className="font-semibold">Address:</p>
							{COMPANY_INFO.addressLines.map((line) => (
								<p key={line} className="ml-0">
									{line}
								</p>
							))}
						</div>
						<div>
							<p className="font-semibold">Telephone Nos.:</p>
							<ul className="mt-1 space-y-1">
								{COMPANY_INFO.phones.map((p) => (
									<li
										key={`${p.label}-${p.value}`}
										className="flex items-start gap-2"
									>
										<span
											className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
											aria-hidden
										/>
										<span>
											{p.label} {p.value}
										</span>
									</li>
								))}
							</ul>
						</div>
						<p>
							<span className="font-semibold">Owner / Manager:</span>{" "}
							{COMPANY_INFO.ownerManager}
						</p>
						<p>
							<span className="font-semibold">Residence Address:</span>{" "}
							{COMPANY_INFO.residenceAddress}
						</p>
						<div>
							<p className="font-semibold">Email Address:</p>
							<ul className="mt-1 space-y-1">
								{COMPANY_INFO.emails.map((e) => (
									<li key={e} className="flex items-start gap-2">
										<span
											className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
											aria-hidden
										/>
										<span>{e}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Business Details */}
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						Business Details
					</h3>
					<div className="mt-3 space-y-2 text-sm text-emerald-900/85">
						<p>
							<span className="font-semibold">Date of Creation:</span>{" "}
							{BUSINESS_DETAILS.dateOfCreation}
						</p>
						<p>
							<span className="font-semibold">Main Services:</span>{" "}
							{BUSINESS_DETAILS.mainServices}
						</p>
					</div>
				</div>

				{/* Human Resources */}
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						Business Capacity — Human Resources
					</h3>
					<ul className="mt-3 space-y-2 text-sm text-emerald-900/85">
						{HUMAN_RESOURCES.map((hr) => (
							<li key={hr.role} className="flex items-start gap-2">
								<span
									className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<span>
									{hr.count} — {hr.role}
								</span>
							</li>
						))}
					</ul>
				</div>

				{/* Machines */}
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						Business Capacity — Types of Machines
					</h3>
					<ul className="mt-3 space-y-2 text-sm text-emerald-900/85">
						{MACHINES.map((m) => (
							<li key={m} className="flex items-start gap-2">
								<span
									className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<span>{m}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Services — We Print */}
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						Services Offered — We Print
					</h3>
					<ul className="mt-3 space-y-2 text-sm text-emerald-900/85">
						{SERVICES_WE_PRINT.map((s) => (
							<li key={s} className="flex items-start gap-2">
								<span
									className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<span>{s}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Services — We Also Offer */}
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						Services Offered — We Also Offer
					</h3>
					<ul className="mt-3 space-y-2 text-sm text-emerald-900/85">
						{SERVICES_WE_OFFER.map((s) => (
							<li key={s} className="flex items-start gap-2">
								<span
									className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<span>{s}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Major Suppliers */}
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						Major Suppliers
					</h3>
					<ul className="mt-3 space-y-2 text-sm text-emerald-900/85">
						{MAJOR_SUPPLIERS.map((s) => (
							<li key={s} className="flex items-start gap-2">
								<span
									className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<span>{s}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
