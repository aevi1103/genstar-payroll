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
import { Hero } from "@/features/home-page/hero";
import { getCompanyInfo } from "@/lib/db/get-company-info";
import { getPublicImages } from "@/lib/db/get-public-images";
import Script from "next/script";

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
		"tarpaulin printing quezon city",
		"same day printing services",
		"printing company project 8",
	],
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

	const companyUrl = "https://www.genstarprintingservices.com";

	// LocalBusiness Schema
	const localBusinessSchema = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"@id": `${companyUrl}/#localbusiness`,
		name: companyInfo.companyName,
		image: `${companyUrl}/logo.png`,
		description:
			"Professional printing services in Quezon City, Philippines. Offset, digital & large-format printing with same-day turnaround. Trusted since 2007.",
		url: companyUrl,
		telephone: companyInfo.mobile,
		priceRange: "$$",
		address: {
			"@type": "PostalAddress",
			streetAddress: companyInfo.streetAddress,
			addressLocality: "Quezon City",
			addressRegion: "Metro Manila",
			postalCode: "1106",
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
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "08:00",
				closes: "17:00",
			},
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: "Saturday",
				opens: "08:00",
				closes: "12:00",
			},
		],
		sameAs: [
			"https://www.facebook.com/genstarprints",
			"https://twitter.com/genstarprints",
		],
		contactPoint: {
			"@type": "ContactPoint",
			telephone: companyInfo.mobile,
			contactType: "customer service",
			areaServed: "PH",
			availableLanguage: ["English", "Tagalog"],
		},
		areaServed: {
			"@type": "GeoCircle",
			geoMidpoint: {
				"@type": "GeoCoordinates",
				latitude: companyInfo.lat,
				longitude: companyInfo.long,
			},
			geoRadius: "50000",
		},
	};

	// Organization Schema
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": `${companyUrl}/#organization`,
		name: companyInfo.companyName,
		url: companyUrl,
		logo: `${companyUrl}/logo.png`,
		foundingDate: companyInfo.dateOfCreation,
		founder: {
			"@type": "Person",
			name: companyInfo.owner,
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: companyInfo.streetAddress,
			addressLocality: "Quezon City",
			addressRegion: "Metro Manila",
			postalCode: "1106",
			addressCountry: "PH",
		},
		contactPoint: {
			"@type": "ContactPoint",
			telephone: companyInfo.mobile,
			contactType: "customer service",
			email: companyInfo.email,
		},
	};

	// WebSite Schema
	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${companyUrl}/#website`,
		url: companyUrl,
		name: companyInfo.companyName,
		description:
			"Premium print solutions - offset, digital, and large-format printing services in Quezon City, Philippines",
		publisher: {
			"@id": `${companyUrl}/#organization`,
		},
		potentialAction: {
			"@type": "SearchAction",
			target: `${companyUrl}/?s={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};

	// BreadcrumbList Schema
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: companyUrl,
			},
		],
	};

	// FAQ Schema
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "What printing services does Genstar offer?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Genstar Printing Services offers offset printing, digital printing, and large-format printing. We specialize in signages, tarpaulins, banners, business cards, brochures, stickers, packaging, and custom print solutions.",
				},
			},
			{
				"@type": "Question",
				name: "Where is Genstar Printing Services located?",
				acceptedAnswer: {
					"@type": "Answer",
					text: `Genstar Printing Services is located at ${companyInfo.fullAddress}. We serve Quezon City, Metro Manila, and surrounding areas.`,
				},
			},
			{
				"@type": "Question",
				name: "Does Genstar offer same-day printing?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes, Genstar Printing Services offers same-day and rush printing services for urgent orders. Contact us for availability and pricing.",
				},
			},
			{
				"@type": "Question",
				name: "How can I contact Genstar Printing Services?",
				acceptedAnswer: {
					"@type": "Answer",
					text: `You can reach us at ${companyInfo.mobile} or email us at ${companyInfo.email}. We're open Monday-Friday 8AM-5PM and Saturday 8AM-12PM.`,
				},
			},
		],
	};

	// Service Schema
	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		serviceType: "Printing Services",
		provider: {
			"@id": `${companyUrl}/#organization`,
		},
		areaServed: {
			"@type": "City",
			name: "Quezon City",
			"@id": "https://en.wikipedia.org/wiki/Quezon_City",
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Printing Services",
			itemListElement: [
				{
					"@type": "OfferCatalog",
					name: "Offset Printing",
					itemListElement: [
						{
							"@type": "Offer",
							itemOffered: {
								"@type": "Service",
								name: "Offset Printing Services",
							},
						},
					],
				},
				{
					"@type": "OfferCatalog",
					name: "Digital Printing",
					itemListElement: [
						{
							"@type": "Offer",
							itemOffered: {
								"@type": "Service",
								name: "Digital Printing Services",
							},
						},
					],
				},
				{
					"@type": "OfferCatalog",
					name: "Large Format Printing",
					itemListElement: [
						{
							"@type": "Offer",
							itemOffered: {
								"@type": "Service",
								name: "Large Format Printing & Signage",
							},
						},
					],
				},
			],
		},
	};

	return (
		<>
			{/* Structured Data for SEO */}
			<Script
				id="local-business-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(localBusinessSchema),
				}}
			/>
			<Script
				id="organization-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(organizationSchema),
				}}
			/>
			<Script
				id="website-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteSchema),
				}}
			/>
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema),
				}}
			/>
			<Script
				id="faq-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
			/>
			<Script
				id="service-schema"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceSchema),
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
