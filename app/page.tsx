import { Header } from "@/features/home-page/header";
import { AboutSection } from "@/features/home-page/about";
import { VisionSection } from "@/features/home-page/vision";
import { ServicesSection } from "@/features/home-page/services";
import { ContactForm } from "@/features/home-page/contact-form";
import { createClient } from "@/lib/supabase/server";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "animate.css";
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import type { Metadata } from "next";
import Script from "next/script";
import { Hero } from "@/features/home-page/hero";

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
				{/* <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />
				<div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" /> */}

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

				<Hero />

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
