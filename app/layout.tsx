import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const companyUrl = "https://www.genstarprintingservices.com";
const developer = "Aebbie Rontos";

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
			<GoogleAnalytics gaId="G-ZQZGQ357XS" />
		</html>
	);
}
