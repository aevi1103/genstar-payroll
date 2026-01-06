"use client";

import type React from "react";
import { useState } from "react";
import {
	Building2,
	Users,
	Settings2,
	Printer,
	Zap,
	Handshake,
	Sparkles,
	ChevronDown,
} from "lucide-react";
import type { CompanyInfo } from "@/lib/db/get-company-info";

export function ServicesSection({
	companyInfo,
}: {
	companyInfo: CompanyInfo;
}): React.ReactElement {
	const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
		{},
	);

	const toggleCard = (cardId: string) => {
		setExpandedCards((prev) => ({
			...prev,
			[cardId]: !prev[cardId],
		}));
	};

	return (
		<section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:py-32">
			{/* Decorative background elements */}
			<div id="services" className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-20 left-10 h-80 w-80 rounded-full bg-emerald-100/20 blur-3xl" />
				<div className="absolute bottom-40 right-20 h-96 w-96 rounded-full bg-blue-100/15 blur-3xl" />
			</div>

			{/* Header */}
			<div className="mb-12 sm:mb-16 md:mb-20 text-center">
				<div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 px-4 sm:px-6 py-2.5 sm:py-3 ring-1 ring-emerald-200">
					<Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
					<span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-700">
						Services
					</span>
				</div>
				<h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-emerald-950">
					Capabilities &{" "}
					<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
						Experience
					</span>
				</h2>
				<p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-emerald-900/70">
					With nearly two decades of excellence, Genstar Printing Services
					combines cutting-edge technology, experienced professionals, and
					trusted partnerships to deliver premium printing solutions.
				</p>
			</div>

			{/* Hero Card */}
			<div className="mb-16 sm:mb-20 md:mb-24 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 p-8 sm:p-10 md:p-12 text-white shadow-xl ring-1 ring-emerald-800/50">
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10" />
				<div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
				<div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl" />
				<div className="relative">
					<div className="grid gap-8 md:grid-cols-2">
						<div className="space-y-6">
							<div>
								<div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2 ring-1 ring-emerald-400/30">
									<Sparkles className="h-4 w-4 text-emerald-300" />
									<span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
										Since 2007
									</span>
								</div>
								<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">
									Genstar Printing Services
								</h3>
								<div className="h-1 w-12 rounded-full bg-linear-to-r from-emerald-400 to-teal-400 mt-3" />
								<p className="mt-4 text-base sm:text-lg text-emerald-100">
									Your trusted partner for premium printing solutions with
									nearly two decades of excellence.
								</p>
							</div>
							<div className="pt-2">
								<p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
									Service Focus
								</p>
								<p className="mt-3 text-base sm:text-lg text-emerald-50 font-medium">
									{companyInfo.mainServices}
								</p>
								<p className="mt-2 text-xs sm:text-sm text-emerald-200">
									{companyInfo.yearInService} years of printing excellence
								</p>
							</div>
						</div>

						<div className="space-y-6">
							<div>
								<p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
									Location
								</p>
								<div className="mt-3 space-y-2">
									{companyInfo.addressLines.map((line) => (
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
									Manager
								</p>
								<p className="mt-3 text-sm sm:text-base text-emerald-50 font-medium">
									{companyInfo.owner}
								</p>
							</div>
							<div>
								<p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
									Contact
								</p>
								<ul className="mt-3 space-y-2">
									{companyInfo.landLine && (
										<li className="text-emerald-50">
											<span className="text-xs text-emerald-300">
												Land Line
											</span>
											<p className="text-sm sm:text-base font-medium text-emerald-100">
												{companyInfo.landLine}
											</p>
										</li>
									)}
									{companyInfo.mobile && (
										<li className="text-emerald-50">
											<span className="text-xs text-emerald-300">Mobile</span>
											<p className="text-sm sm:text-base font-medium text-emerald-100">
												{companyInfo.mobile}
											</p>
										</li>
									)}
									<li className="text-emerald-50 pt-1">
										<span className="text-xs text-emerald-300">Email</span>
										<p className="text-sm sm:text-base font-medium text-emerald-100">
											{companyInfo.email}
										</p>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="my-12 sm:my-16 md:my-20">
				<div className="h-1 w-full rounded-full bg-linear-to-r from-transparent via-emerald-300 to-transparent" />
			</div>

			{/* Grid of Services */}
			<div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{/* Business Details Card */}
				<div className="group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-blue-300">
					<div className="absolute inset-0 bg-linear-to-br from-blue-500/0 via-transparent to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-300" />
					<div className="relative">
						<div className="mb-5 inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 ring-1 ring-blue-200/50">
							<Building2 className="h-7 sm:h-8 w-7 sm:w-8 text-blue-600" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-blue-950">
							Business Foundation
						</h3>
						<div className="h-1 w-8 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 mt-2" />
						<p className="mt-3 text-xs sm:text-sm text-blue-600">
							Established in {companyInfo.dateOfCreation ?? "2007"}
						</p>
						<div className="mt-6 space-y-5 flex-1">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
									Service Focus
								</p>
								<p className="mt-2 text-sm sm:text-base font-medium text-blue-950">
									{companyInfo.mainServices}
								</p>
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
									Years Active
								</p>
								<p className="mt-2 text-sm sm:text-base font-medium text-blue-950">
									{companyInfo.yearInService} years
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Team Card */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					onClick={() => toggleCard("team")}
					className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-purple-300 cursor-pointer"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
					<div className="relative">
						<div className="flex items-start justify-between gap-4">
							<div className="mb-5 inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 ring-1 ring-purple-200/50">
								<Users className="h-7 sm:h-8 w-7 sm:w-8 text-purple-600" />
							</div>
							{companyInfo.companyTeam.length > 3 && (
								<div
									className={`transition-transform duration-300 ${expandedCards.team ? "rotate-180" : ""}`}
								>
									<ChevronDown className="h-5 w-5 text-purple-600" />
								</div>
							)}
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-purple-950">
							Our Team
						</h3>
						<div className="h-1 w-8 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 mt-2" />
						<p className="mt-3 text-xs sm:text-sm text-purple-600">
							{companyInfo.companyTeam.length} skilled professionals
						</p>
						<div className="mt-6 space-y-3 flex-1">
							{(expandedCards.team
								? companyInfo.companyTeam
								: companyInfo.companyTeam.slice(0, 3)
							).map((position) => (
								<div key={position} className="flex items-start gap-3">
									<div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
									<span className="text-xs sm:text-sm text-purple-900/80">
										{position}
									</span>
								</div>
							))}
							{!expandedCards.team && companyInfo.companyTeam.length > 3 && (
								<p className="text-xs text-purple-600 pt-2 font-medium">
									+ {companyInfo.companyTeam.length - 3} more positions
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Equipment Card */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					onClick={() => toggleCard("equipment")}
					className="group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-orange-50 to-amber-50/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-orange-300 cursor-pointer"
				>
					<div className="absolute inset-0 bg-linear-to-br from-orange-500/0 via-transparent to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-300" />
					<div className="relative">
						<div className="flex items-start justify-between gap-4">
							<div className="mb-5 inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 ring-1 ring-orange-200/50">
								<Settings2 className="h-7 sm:h-8 w-7 sm:w-8 text-orange-600" />
							</div>
							{companyInfo.companyMachines.length > 3 && (
								<div
									className={`transition-transform duration-300 ${expandedCards.equipment ? "rotate-180" : ""}`}
								>
									<ChevronDown className="h-5 w-5 text-orange-600" />
								</div>
							)}
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-orange-950">
							Equipment
						</h3>
						<div className="h-1 w-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mt-2" />
						<p className="mt-3 text-xs sm:text-sm text-orange-600">
							{companyInfo.companyMachines.length} precision machines
						</p>
						<div className="mt-6 space-y-3 flex-1">
							{(expandedCards.equipment
								? companyInfo.companyMachines
								: companyInfo.companyMachines.slice(0, 3)
							).map((machine) => (
								<div key={machine} className="flex items-start gap-3">
									<div className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
									<span className="text-xs sm:text-sm text-orange-900/80">
										{machine}
									</span>
								</div>
							))}
							{!expandedCards.equipment &&
								companyInfo.companyMachines.length > 3 && (
									<p className="text-xs text-orange-600 pt-2 font-medium">
										+ {companyInfo.companyMachines.length - 3} more machines
									</p>
								)}
						</div>
					</div>
				</div>

				{/* Printing Services Card */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					onClick={() => toggleCard("printing")}
					className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-green-300 cursor-pointer"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />
					<div className="relative">
						<div className="flex items-start justify-between gap-4">
							<div className="mb-5 inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 ring-1 ring-green-200/50">
								<Printer className="h-7 sm:h-8 w-7 sm:w-8 text-green-600" />
							</div>
							{companyInfo.companyWhatWePrint.length > 6 && (
								<div
									className={`transition-transform duration-300 ${expandedCards.printing ? "rotate-180" : ""}`}
								>
									<ChevronDown className="h-5 w-5 text-green-600" />
								</div>
							)}
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-green-950 mb-4">
							What We Print
						</h3>
						<div className="mt-6 space-y-3 flex-1">
							<div className="grid grid-cols-2 gap-3">
								{(expandedCards.printing
									? companyInfo.companyWhatWePrint
									: companyInfo.companyWhatWePrint.slice(0, 6)
								).map((service) => (
									<div key={service} className="flex items-start gap-2">
										<div className="mt-1 h-2 w-2 rounded-full bg-green-500 shrink-0" />
										<span className="text-xs sm:text-sm text-green-900/80">
											{service}
										</span>
									</div>
								))}
							</div>
							{!expandedCards.printing &&
								companyInfo.companyWhatWePrint.length > 6 && (
									<p className="text-xs text-green-600 pt-2 font-medium">
										+ {companyInfo.companyWhatWePrint.length - 6} more services
									</p>
								)}
						</div>
					</div>
				</div>

				{/* Value Added Services Card */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					onClick={() => toggleCard("services")}
					className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-amber-300 cursor-pointer"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-yellow-500/0 group-hover:from-amber-500/5 group-hover:to-yellow-500/5 transition-all duration-300" />
					<div className="relative">
						<div className="flex items-start justify-between gap-4">
							<div className="mb-5 inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 ring-1 ring-amber-200/50">
								<Zap className="h-7 sm:h-8 w-7 sm:w-8 text-amber-600" />
							</div>
							{companyInfo.companyOtherServices.length > 3 && (
								<div
									className={`transition-transform duration-300 ${expandedCards.services ? "rotate-180" : ""}`}
								>
									<ChevronDown className="h-5 w-5 text-amber-600" />
								</div>
							)}
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-amber-950 mb-2">
							Value-Added Services
						</h3>
						<div className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 mt-2" />
						<p className="mt-3 text-xs sm:text-sm text-amber-600">
							Beyond printing
						</p>
						<div className="mt-6 space-y-3 flex-1">
							{(expandedCards.services
								? companyInfo.companyOtherServices
								: companyInfo.companyOtherServices.slice(0, 3)
							).map((service) => (
								<div key={service} className="flex items-start gap-3">
									<div className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
									<span className="text-xs sm:text-sm text-amber-900/80">
										{service}
									</span>
								</div>
							))}
							{!expandedCards.services &&
								companyInfo.companyOtherServices.length > 3 && (
									<p className="text-xs text-amber-600 pt-2 font-medium">
										+ {companyInfo.companyOtherServices.length - 3} more
										services
									</p>
								)}
						</div>
					</div>
				</div>

				{/* Partners Card */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					onClick={() => toggleCard("partners")}
					className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-indigo-300 cursor-pointer"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-blue-500/0 group-hover:from-indigo-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
					<div className="relative">
						<div className="flex items-start justify-between gap-4">
							<div className="mb-5 inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 ring-1 ring-indigo-200/50">
								<Handshake className="h-7 sm:h-8 w-7 sm:w-8 text-indigo-600" />
							</div>
							{companyInfo.companySuppliers.length > 3 && (
								<div
									className={`transition-transform duration-300 ${expandedCards.partners ? "rotate-180" : ""}`}
								>
									<ChevronDown className="h-5 w-5 text-indigo-600" />
								</div>
							)}
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-indigo-950">
							Partners
						</h3>
						<div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 mt-2" />
						<p className="mt-3 text-xs sm:text-sm text-indigo-600">
							Trusted suppliers
						</p>
						<div className="mt-6 space-y-3 flex-1">
							{(expandedCards.partners
								? companyInfo.companySuppliers
								: companyInfo.companySuppliers.slice(0, 3)
							).map((supplier) => (
								<div key={supplier} className="flex items-start gap-3">
									<div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
									<span className="text-xs sm:text-sm text-indigo-900/80 font-medium">
										{supplier}
									</span>
								</div>
							))}
							{!expandedCards.partners &&
								companyInfo.companySuppliers.length > 3 && (
									<p className="text-xs text-indigo-600 pt-2 font-medium">
										+ {companyInfo.companySuppliers.length - 3} more partners
									</p>
								)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
