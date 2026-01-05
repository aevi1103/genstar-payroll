import { getSessionWithRole } from "@/lib/session";
import { redirect } from "next/navigation";
import { listImages } from "./actions";
import { ImagesPageClient } from "@/features/image-upload/images-page-client";

export default async function ImagesPage() {
	const { session, role } = await getSessionWithRole();

	// Require admin access
	if (!session || role !== "admin") {
		redirect("/auth/login");
	}

	const { files } = await listImages();

	return <ImagesPageClient initialImages={files} />;
}
