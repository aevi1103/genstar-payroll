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
		"ICBM": "14.678685, 121.025716",
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
		<main className="relative min-h-screen bg-linear-to-b from-emerald-50 via-white to-emerald-50 text-emerald-950">
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
							streetAddress: "#97 General Avenue Near Corner Tandang Sora Avenue",
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

			<BackgroundBeams className="absolute inset-0" />

			<Header user={user} />

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

			<section className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:py-24 animate__animated animate__slideInUp animate__slow">
				<div className="flex-1 space-y-6 animate__animated animate__fadeInLeft animate__slower">
					{/* <h1 className="text-4xl font-semibold leading-tight tracking-tight text-emerald-950 md:text-5xl">
						Premium print solutions that move your brand forward.
					</h1> */}

					<TypingText
						text={["Premium print solutions that move your brand forward."]}
						typingSpeed={75}
						pauseDuration={1500}
						showCursor={true}
						cursorCharacter="|"
						className="text-4xl font-semibold leading-tight tracking-tight text-emerald-950 md:text-5xl"
						textColors={["#059669", "#047857", "#065f46"]}
						variableSpeed={{ min: 50, max: 120 }}
						initialDelay={1000}
					/>

					<p className="max-w-2xl text-lg text-emerald-900/80">
						High-quality offset, digital, and large-format printing with
						meticulous color management, fast turnarounds, and a team that
						sweats the details so you do not have to.
					</p>
					<div className="flex flex-wrap gap-3" />
				</div>

				<div className="relative flex-1 animate__animated animate__fadeInRight animate__slower">
					<div className="relative overflow-hidden rounded-3xl bg-white/90 p-6 shadow-2xl ring-1 ring-emerald-100 backdrop-blur">
						<div className="flex items-center justify-between gap-3">
							<h2 className="text-lg font-semibold text-emerald-950">
								Fast, precise, and reliable
							</h2>
							<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
								Since 2007
							</span>
						</div>
						<ul className="mt-4 space-y-3 text-sm text-emerald-900/80">
							<li className="flex items-start gap-2">
								<span
									className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<p>Color-managed workflows to maintain brand consistency.</p>
							</li>
							<li className="flex items-start gap-2">
								<span
									className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<p>Responsive support and timeline clarity for every job.</p>
							</li>
							<li className="flex items-start gap-2">
								<span
									className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<p>Sustainable stock options and precise finishing control.</p>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 animate__animated animate__fadeInUp animate__slow">
				<div className="mb-6 flex items-center justify-between animate__animated animate__fadeIn animate__slower">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
							What we do
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
							Capabilities built around your deadlines
						</h2>
					</div>
					{/* Company profile PDF link removed */}
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 animate__animated animate__fadeInUp animate__slow">
						<p className="text-base font-semibold text-emerald-900">
							Offset printing
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							High-volume precision with exacting ink control for catalogs,
							packaging, and marketing kits.
						</p>
					</div>
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 animate__animated animate__fadeInUp animate__slow animate__delay-1s">
						<p className="text-base font-semibold text-emerald-900">
							Digital printing
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							Fast-turn variable data, short runs, proofs, and personalized
							campaigns without sacrificing quality.
						</p>
					</div>
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 animate__animated animate__fadeInUp animate__slow animate__delay-2s">
						<p className="text-base font-semibold text-emerald-900">
							Large format & signage
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							Banners, standees, billboards, and exhibition graphics engineered
							to stay vivid indoors or outdoors.
						</p>
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
	);
}
