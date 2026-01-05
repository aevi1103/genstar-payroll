"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
	);
}
