"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NavigationIcon } from "lucide-react";

export function ContactForm(): React.ReactElement {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Log to console
		console.log("Contact Form Submission:", formData);

		// Show success toast
		toast.success("Message sent successfully!", {
			description: "We'll get back to you as soon as possible.",
		});

		// Reset form
		setFormData({
			name: "",
			email: "",
			phone: "",
			message: "",
		});
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<section
			id="contact"
			className="relative z-10 mx-auto max-w-6xl px-6 pb-24"
		>
			<div className="mb-6">
				<p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
					Get in Touch
				</p>
				<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
					Contact Us
				</h2>
			</div>

			<Card className="rounded-2xl bg-white/90 p-8 shadow-sm ring-1 ring-emerald-100">
				<div className="grid gap-8 md:grid-cols-2">
					{/* Contact Information and Map */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-emerald-900">
							Let's discuss your printing needs
						</h3>
						<p className="text-sm text-emerald-900/80">
							Whether you need offset printing, digital solutions, or large
							format signage, our team is ready to help bring your vision to
							life.
						</p>

						{/* Map Container */}
						<div className="overflow-hidden rounded-lg ring-1 ring-emerald-100">
							<iframe
								src="https://maps.google.com/maps?q=14.678685,121.025716&z=16&output=embed"
								width="100%"
								height="300"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="w-full"
								title="Genstar Printing Services Location"
							/>
						</div>

						{/* Directions Buttons */}
						<div className="mt-3 flex flex-wrap gap-2">
							<Button asChild variant="outline" size="sm">
								<a
									href="https://www.google.com/maps/dir/?api=1&destination=14.678685,121.025716&travelmode=driving"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Open directions in Google Maps"
								>
									<NavigationIcon className="size-4" />
									Google Maps
								</a>
							</Button>
							<Button asChild variant="outline" size="sm">
								<a
									href="https://waze.com/ul?ll=14.678685,121.025716&navigate=yes&zoom=16"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Open directions in Waze"
								>
									<NavigationIcon className="size-4" />
									Waze
								</a>
							</Button>
						</div>

						<div className="space-y-3 text-sm text-emerald-900/85">
							<div>
								<p className="font-semibold">Email</p>
								<a
									href="mailto:genstarprints@gmail.com"
									className="text-emerald-700 hover:text-emerald-900"
								>
									genstarprints@gmail.com
								</a>
							</div>
							<div>
								<p className="font-semibold">Phone</p>
								<p>Landline: 89294482</p>
								<p>Cell: 09157365273</p>
							</div>
							<div>
								<p className="font-semibold">Address</p>
								<p>#97 General Avenue Near Corner Tandang Sora Avenue</p>
								<p>Project 8 Quezon City</p>
							</div>
						</div>
					</div>

					{/* Contact Form */}
					<div>
						<h3 className="mb-4 text-lg font-semibold text-emerald-900">
							Send us a message
						</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Your name"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="your.email@example.com"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<Input
									id="phone"
									name="phone"
									type="tel"
									value={formData.phone}
									onChange={handleChange}
									placeholder="09XX XXX XXXX"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="message">Message</Label>
								<Textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									placeholder="Tell us about your printing needs..."
									rows={4}
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
							>
								Send Message
							</Button>
						</form>
					</div>
				</div>
			</Card>
		</section>
	);
}
