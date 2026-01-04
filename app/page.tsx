import { Header } from "@/features/home-page/header";
import { AboutSection } from "@/features/home-page/about";
import { VisionSection } from "@/features/home-page/vision";
import { ServicesSection } from "@/features/home-page/services";
import { ContactForm } from "@/features/home-page/contact-form";
import { createClient } from "@/lib/supabase/server";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "animate.css";
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
	title:
		"Premium Print Solutions | Genstar - Offset, Digital & Large Format Printing",
	description:
		"Genstar Print Solutions - Premium offset, digital & large-format printing in Quezon City, Philippines. Fast turnarounds, color-managed workflows, and meticulous attention to detail since 2007.",
	keywords: [
		"offset printing quezon city",
		"digital printing philippines",
		"large format printing quezon city",
		"printing services manila",
		"signage printing philippines",
		"packaging printing quezon city",
		"printing company philippines",
		"print shop quezon city",
	],
	authors: [{ name: "Genstar" }],
	creator: "Genstar",
	publisher: "Genstar",
	formatDetection: {
		email: false,
		telephone: false,
		address: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://genstar-printing.vercel.app/",
		siteName: "Genstar Print Solutions",
		title: "Premium Print Solutions | Genstar",
		description:
			"High-quality offset, digital, and large-format printing with color-managed workflows and fast turnarounds.",
		images: [
			{
				url: "https://genstar-printing.vercel.app/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Genstar Print Solutions",
				type: "image/jpeg",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Premium Print Solutions | Genstar",
		description:
			"High-quality offset, digital, and large-format printing services.",
		creator: "@genstarprint",
		images: ["https://genstar-printing.vercel.app/og-image.jpg"],
	},
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
		googleBot: "index, follow",
	},
	alternates: {
		canonical: "https://genstar-printing.vercel.app/",
	},
	other: {
		"geo.position": "14.678685;121.025716",
		ICBM: "14.678685, 121.025716",
	},
};

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ message?: string }>;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { message } = await searchParams;

	return (
		<>
			{/* Google Analytics */}
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
			</Script>

			{/* JSON-LD Structured Data */}
			<Script
				id="organization-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "LocalBusiness",
						name: "Genstar Print Solutions",
						description:
							"Premium offset, digital, and large-format printing services in Quezon City, Philippines",
						url: "https://genstar-printing.vercel.app/",
						image: "https://genstar-printing.vercel.app/og-image.jpg",
						telephone: "+63-915-736-5273",
						address: {
							"@type": "PostalAddress",
							streetAddress:
								"#97 General Avenue Near Corner Tandang Sora Avenue",
							addressLocality: "Quezon City",
							addressRegion: "NCR",
							postalCode: "1128",
							addressCountry: "PH",
						},
						areaServed: [
							{
								"@type": "City",
								name: "Quezon City",
							},
							{
								"@type": "City",
								name: "Manila",
							},
							{
								"@type": "State",
								name: "National Capital Region",
							},
							{
								"@type": "Country",
								name: "Philippines",
							},
						],
						priceRange: "$$",
						sameAs: [
							"https://www.facebook.com/genstarprint",
							"https://www.linkedin.com/company/genstar",
						],
						contactPoint: {
							"@type": "ContactPoint",
							telephone: "+63-915-736-5273",
							contactType: "Customer Service",
							email: "genstarprints@gmail.com",
							areaServed: "PH",
							availableLanguage: ["en", "tl"],
						},
						services: [
							{
								"@type": "Service",
								name: "Offset Printing",
								description:
									"High-volume precision printing with exacting ink control",
							},
							{
								"@type": "Service",
								name: "Digital Printing",
								description:
									"Fast-turn variable data and short runs without sacrificing quality",
							},
							{
								"@type": "Service",
								name: "Large Format Printing",
								description:
									"Banners, standees, billboards, and exhibition graphics",
							},
						],
						founder: {
							"@type": "Person",
							name: "Mr. Renato D. Reformina",
						},
						foundingDate: "2007-03-19",
						foundingLocation: "Project 8, Quezon City, Philippines",
					}),
				}}
			/>

			<Header user={user} />

			<main className="relative min-h-screen bg-linear-to-b from-emerald-50/50 via-white to-emerald-950/5 text-emerald-950 overflow-hidden">
				{/* Decorative gradient orbs */}
				<div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />
				<div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

				<BackgroundBeams className="absolute inset-0" />

				{message === "no role assigned to user" && (
				<div className="mx-auto max-w-6xl px-6 pt-6 animate__animated animate__pulse">
					<Alert className="border-red-200 bg-red-50">
						<AlertDescription className="text-red-800">
							No role has been assigned to your account. Please contact an
							administrator to request access.
						</AlertDescription>
					</Alert>
				</div>
			)}

			<section className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:py-20 md:flex-row md:items-center md:py-32 animate__animated animate__slideInUp animate__slow">
				<div className="flex-1 space-y-8 animate__animated animate__fadeInLeft animate__slower">
					<div>
						<TypingText
							text={["Premium print solutions that move your brand forward."]}
							typingSpeed={75}
							pauseDuration={1500}
							showCursor={true}
							cursorCharacter="|"
							className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-emerald-950 lg:py-2"
							textColors={["#059669", "#047857", "#065f46"]}
							variableSpeed={{ min: 50, max: 120 }}
							initialDelay={1000}
						/>
					</div>

					<p className="max-w-2xl text-lg sm:text-xl text-emerald-900/75 leading-relaxed">
						High-quality offset, digital, and large-format printing with
						meticulous color management, fast turnarounds, and a team that
						sweats the details so you do not have to.
					</p>
					<div className="flex flex-wrap gap-4 pt-4" />
				</div>

				<div className="relative flex-1 animate__animated animate__fadeInRight animate__slower hover:scale-105 transition-transform duration-500">
					<div className="absolute inset-0 bg-linear-to-br from-emerald-600/20 to-emerald-400/10 rounded-3xl blur-2xl" />
					<div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-emerald-50/30 to-white p-8 shadow-2xl ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300 transition-all duration-500 group">
						<div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full -mr-48 -mt-48 blur-3xl" />
						<div className="relative space-y-6">
							<div className="flex items-center justify-between gap-3">
								<div>
									<h2 className="text-2xl font-bold text-emerald-950">
										Why Choose Us
									</h2>
									<p className="text-sm text-emerald-600 font-semibold mt-1">
										Since 2007 • Premium Quality
									</p>
								</div>
								<span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 whitespace-nowrap">
									18+ Years
								</span>
							</div>

							<div className="space-y-4 pt-4">
								<div className="flex gap-4">
									<div className="shrink-0">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="h-6 w-6 text-emerald-700"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p className="font-semibold text-emerald-950">
											Color-Managed Workflows
										</p>
										<p className="text-sm text-emerald-900/70 mt-0.5">
											Brand consistency guaranteed
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="flex-shrink-0">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="h-6 w-6 text-emerald-700"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p className="font-semibold text-emerald-950">
											Fast Turnarounds
										</p>
										<p className="text-sm text-emerald-900/70 mt-0.5">
											Quick delivery without compromise
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="flex-shrink-0">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="h-6 w-6 text-emerald-700"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p className="font-semibold text-emerald-950">
											Precise Control
										</p>
										<p className="text-sm text-emerald-900/70 mt-0.5">
											Finishing excellence every time
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28 animate__animated animate__fadeInUp animate__slow">
				<div className="mb-12 space-y-4">
					<div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-2 backdrop-blur-sm">
						<span className="h-2 w-2 rounded-full bg-emerald-600" />
						<span className="text-sm font-semibold text-emerald-700">
							Our Capabilities
						</span>
					</div>
					<div>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
							Complete Printing Solutions
						</h2>
						<p className="mt-4 text-lg text-emerald-900/70 max-w-3xl">
							From concept to final product, we deliver excellence across every
							printing method.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
					{/* Offset Printing */}
					<div className="group relative rounded-2xl bg-linear-to-br from-white to-emerald-50/50 p-8 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300/80 hover:bg-linear-to-br hover:from-white hover:to-emerald-100/40 transition-all duration-500 animate__animated animate__fadeInUp animate__slow">
						<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-emerald-600/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative space-y-4">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-600 transition-all duration-300">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="h-8 w-8 text-emerald-700 group-hover:text-white transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-emerald-950">
								Offset Printing
							</h3>
							<p className="text-emerald-900/75 leading-relaxed">
								Large-volume runs with unmatched color precision and crisp,
								professional results.
							</p>
						</div>
					</div>

					{/* Digital Printing */}
					<div className="group relative rounded-2xl bg-linear-to-br from-white to-emerald-50/50 p-8 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300/80 hover:bg-linear-to-br hover:from-white hover:to-emerald-100/40 transition-all duration-500 animate__animated animate__fadeInUp animate__slow animate__delay-1s">
						<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-emerald-600/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative space-y-4">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-600 transition-all duration-300">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="h-8 w-8 text-emerald-700 group-hover:text-white transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01M12 12h4.01M7.29 7.29l2.83 2.83"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-emerald-950">
								Digital Printing
							</h3>
							<p className="text-emerald-900/75 leading-relaxed">
								On-demand flexibility with fast turnarounds for small batches
								and personalized prints.
							</p>
						</div>
					</div>

					{/* Large Format */}
					<div className="group relative rounded-2xl bg-linear-to-br from-white to-emerald-50/50 p-8 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300/80 hover:bg-linear-to-br hover:from-white hover:to-emerald-100/40 transition-all duration-500 animate__animated animate__fadeInUp animate__slow animate__delay-2s">
						<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-emerald-600/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative space-y-4">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-600 transition-all duration-300">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="h-8 w-8 text-emerald-700 group-hover:text-white transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-emerald-950">
								Large Format
							</h3>
							<p className="text-emerald-900/75 leading-relaxed">
								Banners, signage, and displays that command attention with
								vibrant colors and impact.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section
				id="services"
				className="scroll-mt-20 animate__animated animate__fadeIn animate__slow"
			>
				<ServicesSection />
			</section>
			<section
				id="vision"
				className="scroll-mt-20 animate__animated animate__slideInUp animate__slow"
			>
				<VisionSection />
			</section>
			<section
				id="about"
				className="scroll-mt-20 animate__animated animate__fadeInUp animate__slow"
			>
				<AboutSection />
			</section>
			<section
				id="contact"
				className="scroll-mt-20 animate__animated animate__slideInUp animate__slow"
			>
				<ContactForm />
			</section>
			</main>
		</>
	);
}
