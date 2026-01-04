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

export const metadata: Metadata = {
	title: {
		default: "Genstar Printing Services",
		template: "%s | Genstar Printing Services",
	},
	description:
		"Quality-driven offset, digital, and large-format print solutions tailored to your business needs.",
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
