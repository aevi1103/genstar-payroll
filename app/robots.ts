import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/auth/",
					"/dashboard/",
					"/payroll/",
					"/account/",
					"/_next/",
					"/private/",
				],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: [
					"/api/",
					"/auth/",
					"/dashboard/",
					"/payroll/",
					"/account/",
					"/_next/",
					"/private/",
				],
			},
		],
		sitemap: "https://www.genstarprintingservices.com/sitemap.xml",
	};
}
