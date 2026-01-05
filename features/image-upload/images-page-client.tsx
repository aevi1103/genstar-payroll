"use client";

import { ImageGallery } from "./image-gallery";
import { ImageUploadForm } from "./image-upload-form";
import { useRouter } from "next/navigation";

type ImageFile = {
	name: string;
	publicUrl: string;
	createdAt?: string;
	size?: number;
};

export function ImagesPageClient({
	initialImages,
}: { initialImages: ImageFile[] }) {
	const router = useRouter();

	const handleUploadSuccess = () => {
		router.refresh();
	};

	return (
		<div className="container mx-auto py-8 space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Image Management</h1>
				<p className="text-muted-foreground mt-2">
					Upload and manage images for the public website
				</p>
			</div>

			<ImageUploadForm onUploadSuccess={handleUploadSuccess} />

			<ImageGallery initialImages={initialImages} />
		</div>
	);
}
