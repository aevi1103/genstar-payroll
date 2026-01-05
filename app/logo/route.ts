import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cache } from "react";

// Force static generation at build time
export const dynamic = "force-static";
export const revalidate = false;

// Cache the logo file reading operation
const getLogo = cache(() => {
	const logoPath = path.join(process.cwd(), "public", "logo.png");
	return fs.readFileSync(logoPath);
});

export async function GET() {
	const logo = getLogo();

	return new NextResponse(logo, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
