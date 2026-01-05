import type { ReactElement } from "react";
import { Mail, MapPin, Phone, NavigationIcon } from "lucide-react";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactForm } from "./contact-form";
import type { CompanyInfo } from "@/lib/db/get-company-info";

export function Contact({
	apiKey,
	companyInfo,
}: { apiKey: string; companyInfo: CompanyInfo }): ReactElement {
	const directionsLinks = {
		googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${companyInfo.geoLocation}&travelmode=driving`,
		waze: `https://waze.com/ul?ll=${companyInfo.geoLocation}&navigate=yes&zoom=16`,
	};

	return (
		<section className="relative z-10 mx-auto max-w-6xl px-4 lg:py-16 sm:px-6 md:pb-24">
			<div className="mb-8 sm:mb-10 md:mb-12">
				<h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-950">
					Contact Us
				</h2>
				<p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-emerald-900/60">
					Have questions about our printing services? We&apos;d love to hear
					from you. Get in touch and let&apos;s discuss your printing needs.
				</p>
			</div>

			<Card
				id="contact"
				className="overflow-hidden rounded-lg sm:rounded-2xl bg-linear-to-br from-white to-emerald-50 p-6 sm:p-8 md:p-10 shadow-md ring-1 ring-emerald-100"
			>
				<div className="grid gap-8 md:grid-cols-2">
					<div>
						<h3 className="mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-emerald-950">
							Send us a message
						</h3>
						<ContactForm />
					</div>

					{/* Contact Information and Map */}
					<div className="space-y-5 sm:space-y-6">
						<div>
							<h3 className="text-lg sm:text-xl font-bold text-emerald-950">
								Let&apos;s discuss your printing needs
							</h3>
							<p className="mt-2 text-sm sm:text-base leading-relaxed text-emerald-900/75">
								Whether you need offset printing, digital solutions, or large
								format signage, our team is ready to help bring your vision to
								life.
							</p>
						</div>

						{/* Map Container */}
						<div className="overflow-hidden rounded-lg sm:rounded-xl ring-1 ring-emerald-100 shadow-sm">
							<GoogleMapsEmbed
								apiKey={apiKey}
								height={280}
								width="100%"
								mode="place"
								q={companyInfo.geoLocation}
							/>
						</div>

						{/* Directions Buttons */}
						<div className="flex flex-wrap gap-2 sm:gap-3">
							<Button
								asChild
								variant="outline"
								size="sm"
								className="text-xs sm:text-sm"
							>
								<a
									href={directionsLinks.googleMaps}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Open directions in Google Maps"
								>
									<NavigationIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									Google Maps
								</a>
							</Button>
							<Button
								asChild
								variant="outline"
								size="sm"
								className="text-xs sm:text-sm"
							>
								<a
									href={directionsLinks.waze}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Open directions in Waze"
								>
									<NavigationIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									Waze
								</a>
							</Button>
						</div>

						{/* Contact Information Cards */}
						<div className="grid gap-3">
							<div className="group rounded-lg bg-linear-to-br from-emerald-50 to-white p-3 sm:p-4 ring-1 ring-emerald-200 shadow-sm hover:shadow-md hover:ring-emerald-300 transition-all duration-300">
								<div className="flex items-start gap-3">
									<div className="rounded-lg bg-emerald-100 p-2 group-hover:bg-emerald-200 transition-colors">
										<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
									</div>
									<div className="flex-1">
										<p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
											Email
										</p>
										<a
											href={`mailto:${companyInfo.email}`}
											className="mt-1 block text-xs sm:text-sm font-semibold text-emerald-950 hover:text-emerald-700 transition-colors break-all"
										>
											{companyInfo.email}
										</a>
									</div>
								</div>
							</div>
							<div className="group rounded-lg bg-linear-to-br from-emerald-50 to-white p-3 sm:p-4 ring-1 ring-emerald-200 shadow-sm hover:shadow-md hover:ring-emerald-300 transition-all duration-300">
								<div className="flex items-start gap-3">
									<div className="rounded-lg bg-emerald-100 p-2 group-hover:bg-emerald-200 transition-colors">
										<Phone className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
									</div>
									<div className="flex-1">
										<p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
											Phone
										</p>
										<div className="mt-1 space-y-0.5">
											<p className="text-xs sm:text-sm text-emerald-950">
												<span className="font-semibold text-emerald-700">
													Landline:
												</span>{" "}
												{companyInfo.landLine}
											</p>
											<p className="text-xs sm:text-sm text-emerald-950">
												<span className="font-semibold text-emerald-700">
													Cell:
												</span>{" "}
												{companyInfo.mobile}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="group rounded-lg bg-linear-to-br from-emerald-50 to-white p-3 sm:p-4 ring-1 ring-emerald-200 shadow-sm hover:shadow-md hover:ring-emerald-300 transition-all duration-300">
								<div className="flex items-start gap-3">
									<div className="rounded-lg bg-emerald-100 p-2 group-hover:bg-emerald-200 transition-colors">
										<MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
									</div>
									<div className="flex-1">
										<p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
											Address
										</p>
										<div className="mt-1 space-y-0.5 text-xs sm:text-sm text-emerald-950">
											{companyInfo.addressLines.map((line) => (
												<p key={line}>{line}</p>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</section>
	);
}
