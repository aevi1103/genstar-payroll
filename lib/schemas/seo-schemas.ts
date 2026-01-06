import type { CompanyInfo } from "../db/get-company-info";

export function generateSEOSchemas(
	companyInfo: CompanyInfo,
	companyUrl: string,
) {
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

	return {
		localBusinessSchema,
		organizationSchema,
		websiteSchema,
		breadcrumbSchema,
		faqSchema,
		serviceSchema,
	};
}
