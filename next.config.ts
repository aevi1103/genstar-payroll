import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "bihxozpwhygikyndwhax.supabase.co",
				pathname: "/storage/v1/object/public/**",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb",
		},
	},
};

export default nextConfig;
