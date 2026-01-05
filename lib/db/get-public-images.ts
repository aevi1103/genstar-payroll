import { createClient } from "../supabase/server";

export const getPublicImages = async () => {
	const supabase = await createClient();

	const { data: files, error } = await supabase.storage
		.from("images")
		.list("", {
			limit: 100,
			offset: 0,
			sortBy: { column: "created_at", order: "desc" },
		});

	if (error) {
		console.error("Error fetching public images:", error);
		return null;
	}

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

	return filesWithUrls;
};

export type PublicImages = Awaited<ReturnType<typeof getPublicImages>>;
