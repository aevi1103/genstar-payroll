import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const companyUrl =
	process.env.PROD_SITE_URL || "https://www.genstarprintingservices.com";
const developer = process.env.DEVELOPER || "Aebbie Rontos";
const gaId = process.env.GA_ID || "G-ZQZGQ357XS";

export const metadata: Metadata = {
	metadataBase: new URL(companyUrl),
	title: {
		default: "Genstar Printing Services",
		template: "%s | Genstar Printing Services",
	},
	description:
		"Professional printing services in Quezon City, Philippines. Offset, digital & large-format printing with same-day turnaround. Free quotes. Trusted since 2007. Call +63-915-736-5273 or visit us today!",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: companyUrl,
		siteName: "Genstar Printing Services",
		title: "Premium Print Solutions | Genstar Printing Services",
		description:
			"High-quality offset, digital, and large-format printing with color-managed workflows and fast turnarounds.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Genstar Printing Services - Premium Print Solutions",
			},
		],
	},
	keywords: [
		// Core location-based keywords
		"printing services quezon city",
		"printing services manila",
		"printing services philippines",
		"print shop quezon city",
		"printing company manila",
		"printing company philippines",
		"printing services project 8",
		"printing services near me",

		// Service-specific keywords
		"offset printing quezon city",
		"offset printing manila",
		"offset printing philippines",
		"digital printing quezon city",
		"digital printing manila",
		"digital printing philippines",
		"large format printing quezon city",
		"large format printing manila",
		"large format printing philippines",

		// Product keywords
		"tarpaulin printing quezon city",
		"tarpaulin printing manila",
		"signage printing philippines",
		"signage printing quezon city",
		"banner printing quezon city",
		"banner printing manila",
		"poster printing philippines",
		"poster printing quezon city",
		"sticker printing quezon city",
		"sticker printing manila",
		"business card printing quezon city",
		"business card printing manila",
		"brochure printing philippines",
		"brochure printing quezon city",
		"flyer printing manila",
		"catalog printing philippines",
		"packaging printing quezon city",
		"vinyl printing philippines",
		"canvas printing quezon city",
		"photo printing manila",

		// Speed/service keywords
		"same day printing quezon city",
		"same day printing manila",
		"rush printing services philippines",
		"fast printing quezon city",
		"quick printing manila",
		"express printing philippines",
		"24 hour printing quezon city",

		// Location-specific
		"printer near project 8",
		"printing along general avenue",
		"printer tandang sora",
		"printing near me quezon city",

		// Quality/value keywords
		"affordable printing quezon city",
		"cheap printing manila",
		"quality printing services philippines",
		"professional printing quezon city",
		"commercial printing manila",
		"custom printing philippines",
		"best printing services quezon city",
		"trusted printing company manila",
	],
	applicationName: "Genstar Printing Services",
	referrer: "origin-when-cross-origin",
	authors: [{ name: developer }],
	creator: developer,
	publisher: developer,
	formatDetection: {
		email: false,
		telephone: false,
		address: false,
	},
	twitter: {
		card: "summary_large_image",
		title: "Premium Print Solutions | Genstar Printing Services",
		description:
			"High-quality offset, digital, and large-format printing services.",
		creator: "@genstarprints",
		images: ["https://www.genstarprintingservices.com/logo.png"],
	},
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "/",
		languages: {
			"en-US": "/en-US",
		},
	},
	verification: {
		google: "your-google-verification-code",
	},
	category: "business",
	other: {
		"geo.position": "14.678685;121.025716",
		ICBM: "14.678685, 121.025716",
	},
	icons: {
		icon: "/logo.png",
		shortcut: "/shortcut-icon.png",
		apple: "/apple-icon.png",
		other: {
			rel: "apple-touch-icon-precomposed",
			url: "/apple-touch-icon-precomposed.png",
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>{children}</Providers>
				<Toaster position="top-center" richColors />
			</body>
			<GoogleAnalytics gaId={gaId} />
			<Analytics />
			<SpeedInsights />
		</html>
	);
}
