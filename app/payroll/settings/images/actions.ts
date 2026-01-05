"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionWithRole } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type UploadImageResult = {
	success: boolean;
	publicUrl?: string;
	error?: string;
};

/**
 * Upload an image to Supabase storage (images bucket)
 * Only admins can upload images
 */
export async function uploadImage(
	formData: FormData,
): Promise<UploadImageResult> {
	try {
		// Check authentication and authorization
		const { session, role } = await getSessionWithRole();
		if (!session) {
			return { success: false, error: "Unauthorized - please log in" };
		}
		if (role !== "admin") {
			return { success: false, error: "Forbidden - admin access required" };
		}

		const file = formData.get("file") as File;
		if (!file) {
			return { success: false, error: "No file provided" };
		}

		// Validate file type
		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/webp",
			"image/gif",
		];
		if (!allowedTypes.includes(file.type)) {
			return {
				success: false,
				error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed",
			};
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return {
				success: false,
				error: "File size exceeds 5MB limit",
			};
		}

		const supabase = await createClient();

		// Generate unique filename with timestamp
		const timestamp = Date.now();
		const fileExt = file.name.split(".").pop();
		const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

		// Upload to Supabase storage
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("images")
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (uploadError) {
			console.error("Upload error:", uploadError);
			return {
				success: false,
				error: `Upload failed: ${uploadError.message}`,
			};
		}

		// Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from("images").getPublicUrl(uploadData.path);

		revalidatePath("/payroll/settings/images");
		return { success: true, publicUrl };
	} catch (error) {
		console.error("Image upload error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

/**
 * Delete an image from Supabase storage
 */
export async function deleteImage(
	fileName: string,
): Promise<UploadImageResult> {
	try {
		// Check authentication and authorization
		const { session, role } = await getSessionWithRole();
		if (!session) {
			return { success: false, error: "Unauthorized - please log in" };
		}
		if (role !== "admin") {
			return { success: false, error: "Forbidden - admin access required" };
		}

		if (!fileName) {
			return { success: false, error: "No filename provided" };
		}

		const supabase = await createClient();

		// Delete from Supabase storage
		const { error: deleteError } = await supabase.storage
			.from("images")
			.remove([fileName]);

		if (deleteError) {
			console.error("Delete error:", deleteError);
			return {
				success: false,
				error: `Delete failed: ${deleteError.message}`,
			};
		}

		revalidatePath("/payroll/settings/images");
		return { success: true };
	} catch (error) {
		console.error("Image delete error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

/**
 * List all images in the storage bucket
 */
export async function listImages() {
	try {
		const { session, role } = await getSessionWithRole();
		if (!session) {
			return {
				success: false,
				error: "Unauthorized - please log in",
				files: [],
			};
		}
		if (role !== "admin") {
			return {
				success: false,
				error: "Forbidden - admin access required",
				files: [],
			};
		}

		const supabase = await createClient();

		const { data: files, error } = await supabase.storage
			.from("images")
			.list("", {
				limit: 100,
				offset: 0,
				sortBy: { column: "created_at", order: "desc" },
			});

		if (error) {
			console.error("List error:", error);
			return {
				success: false,
				error: `Failed to list images: ${error.message}`,
				files: [],
			};
		}

		// Get public URLs for all files
		const filesWithUrls =
			files?.map((file) => {
				const {
					data: { publicUrl },
				} = supabase.storage.from("images").getPublicUrl(file.name);
				return {
					name: file.name,
					publicUrl,
					createdAt: file.created_at,
					size: file.metadata?.size || 0,
				};
			}) || [];

		return { success: true, files: filesWithUrls };
	} catch (error) {
		console.error("List images error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			files: [],
		};
	}
}

export type Images = Awaited<ReturnType<typeof listImages>>["files"];
