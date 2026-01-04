"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NavigationIcon } from "lucide-react";
import { submitContactForm } from "./actions";
import {
	contactFormSchema,
	type ContactFormData,
} from "@/lib/schemas/contact-form.schema";

export function ContactForm(): React.ReactElement {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ContactFormData>({
		resolver: standardSchemaResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			message: "",
		},
	});

	const onSubmit = async (data: ContactFormData) => {
		setIsSubmitting(true);
		try {
			const result = await submitContactForm(data);

			if (result.success) {
				toast.success("Message sent successfully!", {
					description: result.message,
				});
				form.reset();
			} else {
				toast.error("Failed to send message", {
					description: result.message,
				});
			}
		} catch (error) {
			toast.error("An unexpected error occurred", {
				description:
					error instanceof Error ? error.message : "Please try again later.",
			});
		} finally {
			setIsSubmitting(false);
		}
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
					{/* Contact Form */}
					<div>
						<h3 className="mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-emerald-950">
							Send us a message
						</h3>
						<Form {...form}>
							<form
								id="contact"
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 sm:space-y-5"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm sm:text-base font-semibold text-emerald-950">
												Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Your name"
													{...field}
													disabled={isSubmitting}
													className="rounded-lg sm:rounded-lg border-emerald-500 bg-white/80 px-4 py-2 sm:py-2.5 text-sm sm:text-base placeholder:text-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500"
												/>
											</FormControl>
											<FormMessage className="text-xs sm:text-sm" />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm sm:text-base font-semibold text-emerald-950">
												Email
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="your.email@example.com"
													{...field}
													disabled={isSubmitting}
													className="rounded-lg sm:rounded-lg border-emerald-500 bg-white/80 px-4 py-2 sm:py-2.5 text-sm sm:text-base placeholder:text-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500"
												/>
											</FormControl>
											<FormMessage className="text-xs sm:text-sm" />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm sm:text-base font-semibold text-emerald-950">
												Phone (Optional)
											</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="09XX XXX XXXX"
													{...field}
													disabled={isSubmitting}
													className="rounded-lg sm:rounded-lg border-emerald-500 bg-white/80 px-4 py-2 sm:py-2.5 text-sm sm:text-base placeholder:text-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500"
												/>
											</FormControl>
											<FormMessage className="text-xs sm:text-sm" />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm sm:text-base font-semibold text-emerald-950">
												Message
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Tell us about your printing needs..."
													rows={4}
													{...field}
													disabled={isSubmitting}
													className="rounded-lg sm:rounded-lg border-emerald-500 bg-white/80 px-4 py-2 sm:py-2.5 text-sm sm:text-base placeholder:text-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
												/>
											</FormControl>
											<FormMessage className="text-xs sm:text-sm" />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full rounded-lg sm:rounded-lg bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:shadow-emerald-600/50 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											<span className="hidden sm:inline">Sending</span>
											<span className="sm:hidden">Send</span>...
										</>
									) : (
										"Send Message"
									)}
								</Button>

								<p className="text-center text-xs sm:text-sm text-emerald-900/60">
									We&apos;ll get back to you as soon as possible.
								</p>
							</form>
						</Form>
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
							<iframe
								src="https://maps.google.com/maps?q=14.678685,121.025716&z=16&output=embed"
								width="100%"
								height="280"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="w-full"
								title="Genstar Printing Services Location"
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
									href="https://www.google.com/maps/dir/?api=1&destination=14.678685,121.025716&travelmode=driving"
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
									href="https://waze.com/ul?ll=14.678685,121.025716&navigate=yes&zoom=16"
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
											href={`mailto:${process.env.NEXT_PUBLIC_GENSTAR_EMAIL || "genstarprints@gmail.com"}`}
											className="mt-1 block text-xs sm:text-sm font-semibold text-emerald-950 hover:text-emerald-700 transition-colors break-all"
										>
											{process.env.NEXT_PUBLIC_GENSTAR_EMAIL ||
												"genstarprints@gmail.com"}
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
												89294482
											</p>
											<p className="text-xs sm:text-sm text-emerald-950">
												<span className="font-semibold text-emerald-700">
													Cell:
												</span>{" "}
												09157365273
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="group rounded-lg bg-gradient-to-br from-emerald-50 to-white p-3 sm:p-4 ring-1 ring-emerald-200 shadow-sm hover:shadow-md hover:ring-emerald-300 transition-all duration-300">
								<div className="flex items-start gap-3">
									<div className="rounded-lg bg-emerald-100 p-2 group-hover:bg-emerald-200 transition-colors">
										<MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
									</div>
									<div className="flex-1">
										<p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
											Address
										</p>
										<div className="mt-1 space-y-0.5 text-xs sm:text-sm text-emerald-950">
											<p>#97 General Avenue Near Corner Tandang Sora Avenue</p>
											<p>Project 8 Quezon City</p>
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
