import { Header } from "@/features/home-page/header";
import { AboutSection } from "@/features/home-page/about";
import { VisionSection } from "@/features/home-page/vision";
import { ServicesSection } from "@/features/home-page/services";
import { Contact } from "@/features/home-page/contact";
import { ImagesSection } from "@/features/home-page/images";
import { createClient } from "@/lib/supabase/server";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "animate.css";
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import type { Metadata } from "next";
import Script from "next/script";
import { Hero } from "@/features/home-page/hero";
import { getCompanyInfo } from "@/lib/db/get-company-info";
import { listImages } from "./payroll/settings/images/actions";
import { getPublicImages } from "@/lib/db/get-public-images";

const publicLogo = "https://www.genstarprintingservices.com/logo";

const baseMetadata: Metadata = {
	title:
		"Premium Print Solutions | Genstar - Offset, Digital & Large Format Printing",
	description:
		"Professional printing services in Quezon City, Philippines. Offset, digital & large-format printing with same-day turnaround. Free quotes. Trusted since 2007. Call +63-915-736-5273 or visit us today!",
	keywords: [
		"offset printing quezon city",
		"digital printing philippines",
		"large format printing quezon city",
		"printing services manila",
		"signage printing philippines",
		"packaging printing quezon city",
		"printing company philippines",
		"print shop quezon city",
		"tarpaulin printing near me",
		"business card printing manila",
		"banner printing quezon city",
		"same day printing philippines",
		"affordable printing services",
		"sticker printing quezon city",
		"brochure printing manila",
		"rush printing services",
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
		url: "https://www.genstarprintingservices.com/",
		siteName: "Genstar Printing Services",
		title: "Premium Print Solutions | Genstar Printing Services",
		description:
			"High-quality offset, digital, and large-format printing with color-managed workflows and fast turnarounds.",
		images: [
			{
				url: publicLogo,
				width: 1200,
				height: 630,
				alt: "Genstar Print Solutions",
				type: "image/jpeg",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Premium Print Solutions | Genstar Printing Services",
		description:
			"High-quality offset, digital, and large-format printing services.",
		creator: "@genstarprint",
		images: [publicLogo],
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
		canonical: "https://www.genstarprintingservices.com/",
	},
	other: {
		"geo.position": "14.678685;121.025716",
		ICBM: "14.678685, 121.025716",
	},
};

export async function generateMetadata(): Promise<Metadata> {
	const companyInfo = await getCompanyInfo();

	return {
		...baseMetadata,
		other: {
			"geo.position": `${companyInfo.lat};${companyInfo.long}`,
			ICBM: `${companyInfo.lat}, ${companyInfo.long}`,
		},
	};
}

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
	const apiKey = process.env.GOOGLE_CLOUD_API_KEY || "";

	const companyInfo = await getCompanyInfo();
	const images = await getPublicImages();

	return (
		<>
			{/* JSON-LD Structured Data */}
			{/* Organization Schema */}
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
							"Premium offset, digital, and large-format printing services in Quezon City, Philippines. Same-day turnaround available.",
						url: "https://www.genstarprintingservices.com/",
						image: "https://www.genstarprintingservices.com/og-image.jpg",
						telephone: companyInfo.mobile,
						email: companyInfo.email,
						address: {
							"@type": "PostalAddress",
							streetAddress: companyInfo.streetAddress,
							addressLocality: companyInfo.cityAddress,
							addressRegion: companyInfo.regionAddress ?? "NCR",
							postalCode: "1128",
							addressCountry: "PH",
						},
						geo: {
							"@type": "GeoCoordinates",
							latitude: companyInfo.lat,
							longitude: companyInfo.long,
						},
						openingHoursSpecification: [
							{
								"@type": "OpeningHoursSpecification",
								dayOfWeek: [
									"Monday",
									"Tuesday",
									"Wednesday",
									"Thursday",
									"Friday",
								],
								opens: "08:00",
								closes: "17:00",
							},
							{
								"@type": "OpeningHoursSpecification",
								dayOfWeek: "Saturday",
								opens: "08:00",
								closes: "14:00",
							},
						],
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
								"@type": "City",
								name: "Caloocan",
							},
							{
								"@type": "City",
								name: "Marikina",
							},
							{
								"@type": "State",
								name: "National Capital Region",
							},
						],
						priceRange: "$$",
						aggregateRating: {
							"@type": "AggregateRating",
							ratingValue: "4.8",
							bestRating: "5",
							worstRating: "1",
							ratingCount: "127",
						},
						sameAs: [
							"https://www.facebook.com/genstarprint",
							"https://www.linkedin.com/company/genstar",
						],
						contactPoint: {
							"@type": "ContactPoint",
							telephone: companyInfo.mobile,
							contactType: "Customer Service",
							email: companyInfo.email,
							areaServed: "PH",
							availableLanguage: ["en", "tl"],
							contactOption: ["TollFree", "HearingImpairedSupported"],
						},
						hasOfferCatalog: {
							"@type": "OfferCatalog",
							name: "Printing Services",
							itemListElement: [
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Offset Printing",
										description:
											"High-volume precision printing with exacting ink control for brochures, catalogs, and magazines",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Digital Printing",
										description:
											"Fast-turn variable data, business cards, flyers, and short runs with same-day availability",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Large Format Printing",
										description:
											"Banners, tarpaulins, standees, billboards, and exhibition graphics up to 10ft wide",
									},
								},
								{
									"@type": "Offer",
									itemOffered: {
										"@type": "Service",
										name: "Sticker & Label Printing",
										description:
											"Custom stickers, labels, decals in various sizes and finishes",
									},
								},
							],
						},
						founder: {
							"@type": "Person",
							name: companyInfo.owner,
						},
						foundingDate: "2007-03-19",
						foundingLocation: "Project 8, Quezon City, Philippines",
					}),
				}}
			/>

			{/* FAQ Schema */}
			<Script
				id="faq-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: [
							{
								"@type": "Question",
								name: "What printing services do you offer in Quezon City?",
								acceptedAnswer: {
									"@type": "Answer",
									text: "We offer offset printing, digital printing, large format printing (banners, tarpaulins, standees), business cards, brochures, stickers, labels, and packaging printing services in Quezon City and Metro Manila.",
								},
							},
							{
								"@type": "Question",
								name: "Do you offer same-day printing services?",
								acceptedAnswer: {
									"@type": "Answer",
									text: "Yes, we offer same-day rush printing for digital printing services including business cards, flyers, and small format prints. Contact us before 10 AM for same-day delivery.",
								},
							},
							{
								"@type": "Question",
								name: "Where is Genstar Print Solutions located?",
								acceptedAnswer: {
									"@type": "Answer",
									text: `We are located at ${companyInfo.fullAddress}. We serve Quezon City, Manila, Caloocan, and all of Metro Manila.`,
								},
							},
							{
								"@type": "Question",
								name: "What are your business hours?",
								acceptedAnswer: {
									"@type": "Answer",
									text: "We are open Monday to Friday from 8:00 AM to 5:00 PM, and Saturday from 8:00 AM to 2:00 PM. We are closed on Sundays and public holidays.",
								},
							},
							{
								"@type": "Question",
								name: "How can I get a quote for printing services?",
								acceptedAnswer: {
									"@type": "Answer",
									text: `You can get a free quote by calling us at ${companyInfo.mobile}, emailing ${companyInfo.email}, or filling out our contact form on this website. We typically respond within 2 hours during business hours.`,
								},
							},
							{
								"@type": "Question",
								name: "What is the difference between offset and digital printing?",
								acceptedAnswer: {
									"@type": "Answer",
									text: "Offset printing is ideal for high-volume orders (1000+ pieces) with superior color accuracy and cost-effectiveness. Digital printing is perfect for short runs, variable data, and quick turnarounds with same-day availability. We can help you choose the best option for your project.",
								},
							},
						],
					}),
				}}
			/>

			{/* Breadcrumb Schema */}
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								name: "Home",
								item: "https://www.genstarprintingservices.com/",
							},
							{
								"@type": "ListItem",
								position: 2,
								name: "Printing Services",
								item: "https://www.genstarprintingservices.com/#services",
							},
						],
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

				<Hero companyInfo={companyInfo} />

				<section
					id="services"
					className="scroll-mt-20 animate__animated animate__fadeIn animate__slow"
				>
					<ServicesSection companyInfo={companyInfo} />
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
					id="gallery"
					className="scroll-mt-20 animate__animated animate__fadeInUp animate__slow"
				>
					<ImagesSection images={images || []} />
				</section>
				<section
					id="contact"
					className="scroll-mt-20 animate__animated animate__slideInUp animate__slow"
				>
					<Contact apiKey={apiKey} companyInfo={companyInfo} />
				</section>
			</main>
		</>
	);
}
