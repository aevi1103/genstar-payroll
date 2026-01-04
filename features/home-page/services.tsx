"use client";

import type React from "react";
import {
	Building2,
	Users,
	Settings2,
	Printer,
	Zap,
	Handshake,
} from "lucide-react";

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
			className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24"
		>
			{/* Header */}
			<div className="mb-10 sm:mb-12 md:mb-16">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
					<Building2 className="h-4 w-4 text-emerald-700" />
					<span className="text-xs sm:text-sm font-semibold text-emerald-700">
						About Us
					</span>
				</div>
				<h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-emerald-950">
					Capabilities & Experience
				</h2>
				<p className="mt-3 sm:mt-4 max-w-3xl text-base sm:text-lg text-emerald-900/60">
					With nearly two decades of excellence, Genstar Printing Services
					combines cutting-edge technology, experienced professionals, and
					trusted partnerships to deliver premium printing solutions.
				</p>
			</div>

			{/* Hero Card */}
			<div className="mb-10 sm:mb-12 overflow-hidden rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 sm:p-8 text-white shadow-lg">
				<div className="grid gap-6 sm:gap-8 md:grid-cols-2">
					<div className="space-y-6">
						<div>
							<h3 className="text-xl sm:text-2xl font-bold">
								Genstar Printing Services
							</h3>
							<p className="mt-2 text-sm sm:text-base text-emerald-100">
								Your trusted partner since 2007
							</p>
						</div>
						<div>
							<p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
								Location
							</p>
							<div className="mt-2 space-y-1">
								{COMPANY_INFO.addressLines.map((line) => (
									<p
										key={line}
										className="text-sm sm:text-base text-emerald-50"
									>
										{line}
									</p>
								))}
							</div>
						</div>
						<div>
							<p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
								Owner
							</p>
							<p className="mt-2 text-sm sm:text-base text-emerald-50 font-medium">
								{COMPANY_INFO.ownerManager}
							</p>
						</div>
					</div>

					<div className="space-y-6">
						<div>
							<p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
								Contact Us
							</p>
							<ul className="mt-2 space-y-3">
								{COMPANY_INFO.phones.slice(0, 2).map((p) => (
									<li key={`${p.label}-${p.value}`} className="text-emerald-50">
										<span className="block text-xs text-emerald-200">
											{p.label}
										</span>
										<span className="text-sm sm:text-base font-medium">
											{p.value}
										</span>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
								Email
							</p>
							<p className="mt-2 text-sm sm:text-base text-emerald-50">
								{COMPANY_INFO.emails[0]}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Grid of Services */}
			<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{/* Business Details Card */}
				<div className="group flex flex-col rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-200">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
						<Building2 className="h-6 w-6 text-blue-600" />
					</div>
					<h3 className="text-base sm:text-lg font-bold text-emerald-950">
						Business Foundation
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-emerald-600">
						Established in {BUSINESS_DETAILS.dateOfCreation.slice(-4)}
					</p>
					<div className="mt-6 space-y-4 flex-1">
						<div>
							<p className="text-xs font-semibold uppercase text-emerald-700">
								Service Focus
							</p>
							<p className="mt-1 text-sm sm:text-base font-medium text-emerald-950">
								{BUSINESS_DETAILS.mainServices}
							</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase text-emerald-700">
								Years Active
							</p>
							<p className="mt-1 text-sm sm:text-base font-medium text-emerald-950">
								{new Date().getFullYear() - 2007} years
							</p>
						</div>
					</div>
				</div>

				{/* Team Card */}
				<div className="group flex flex-col rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-200">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
						<Users className="h-6 w-6 text-purple-600" />
					</div>
					<h3 className="text-base sm:text-lg font-bold text-emerald-950">
						Our Team
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-emerald-600">
						{HUMAN_RESOURCES.reduce((sum, hr) => sum + hr.count, 0)} skilled
						professionals
					</p>
					<div className="mt-6 space-y-2 flex-1">
						{HUMAN_RESOURCES.slice(0, 3).map((hr) => (
							<div key={hr.role} className="flex items-start gap-3">
								<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
								<span className="text-xs sm:text-sm text-emerald-900/80">
									{hr.role}
								</span>
							</div>
						))}
						{HUMAN_RESOURCES.length > 3 && (
							<p className="text-xs text-emerald-600 pt-2">
								+ {HUMAN_RESOURCES.length - 3} more positions
							</p>
						)}
					</div>
				</div>

				{/* Equipment Card */}
				<div className="group flex flex-col rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-200">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
						<Settings2 className="h-6 w-6 text-orange-600" />
					</div>
					<h3 className="text-base sm:text-lg font-bold text-emerald-950">
						Equipment
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-emerald-600">
						{MACHINES.length} precision machines
					</p>
					<div className="mt-6 space-y-2 flex-1">
						{MACHINES.slice(0, 3).map((m) => (
							<div key={m} className="flex items-start gap-3">
								<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
								<span className="text-xs sm:text-sm text-emerald-900/80">
									{m}
								</span>
							</div>
						))}
						{MACHINES.length > 3 && (
							<p className="text-xs text-emerald-600 pt-2">
								+ {MACHINES.length - 3} more machines
							</p>
						)}
					</div>
				</div>

				{/* Printing Services Card */}
				<div className="group flex flex-col rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-200">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
						<Printer className="h-6 w-6 text-green-600" />
					</div>
					<h3 className="text-base sm:text-lg font-bold text-emerald-950">
						What We Print
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-emerald-600">
						{SERVICES_WE_PRINT.length} printing specializations
					</p>
					<div className="mt-6 grid grid-cols-2 gap-2 flex-1">
						{SERVICES_WE_PRINT.map((s) => (
							<div key={s} className="flex items-start gap-2">
								<div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
								<span className="text-xs sm:text-sm text-emerald-900/80">
									{s}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Value Added Services Card */}
				<div className="group flex flex-col rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-200">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
						<Zap className="h-6 w-6 text-amber-600" />
					</div>
					<h3 className="text-base sm:text-lg font-bold text-emerald-950">
						Value-Added Services
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-emerald-600">
						Beyond printing
					</p>
					<div className="mt-6 space-y-2 flex-1">
						{SERVICES_WE_OFFER.map((s) => (
							<div key={s} className="flex items-start gap-3">
								<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
								<span className="text-xs sm:text-sm text-emerald-900/80">
									{s}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Partners Card */}
				<div className="group flex flex-col rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-200">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
						<Handshake className="h-6 w-6 text-indigo-600" />
					</div>
					<h3 className="text-base sm:text-lg font-bold text-emerald-950">
						Partners
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-emerald-600">
						Trusted suppliers
					</p>
					<div className="mt-6 space-y-2 flex-1">
						{MAJOR_SUPPLIERS.map((s) => (
							<div key={s} className="flex items-start gap-3">
								<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
								<span className="text-xs sm:text-sm text-emerald-900/80 font-medium">
									{s}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
