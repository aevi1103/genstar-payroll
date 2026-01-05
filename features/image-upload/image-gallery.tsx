"use client";

import { deleteImage } from "@/app/payroll/settings/images/actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyIcon, TrashIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ImageFile = {
	name: string;
	publicUrl: string;
	createdAt?: string;
	size?: number;
};

export function ImageGallery({
	initialImages,
}: {
	initialImages: ImageFile[];
}) {
	const router = useRouter();
	const [images, setImages] = useState(initialImages);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Sync state with initialImages when they change (after upload)
	useEffect(() => {
		setImages(initialImages);
	}, [initialImages]);

	const handleCopyUrl = (url: string) => {
		navigator.clipboard.writeText(url);
		toast.success("URL copied to clipboard!");
	};

	const handleDelete = async () => {
		if (!deleteTarget) return;

		setIsDeleting(true);
		const loadingToast = toast.loading("Deleting image...");

		try {
			const result = await deleteImage(deleteTarget);
			if (result.success) {
				setImages((prev) => prev.filter((img) => img.name !== deleteTarget));
				toast.success("Image deleted successfully", { id: loadingToast });
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete image", {
					id: loadingToast,
				});
			}
		} catch (error) {
			console.error("Delete error:", error);
			toast.error("An unexpected error occurred", { id: loadingToast });
		} finally {
			setIsDeleting(false);
			setDeleteTarget(null);
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "Unknown";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Uploaded Images</CardTitle>
					<CardDescription>
						{images.length === 0
							? "No images uploaded yet"
							: `${images.length} image${images.length === 1 ? "" : "s"} in storage`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{images.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<p className="text-muted-foreground">
								Upload your first image to get started
							</p>
						</div>
					) : (
						<div
							className="flex flex-col sm:grid sm:grid-cols-2
             lg:grid-cols-3 xl:grid-cols-4 gap-6"
						>
							{images.map((image) => (
								<div
									key={image.name}
									className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
								>
									<AspectRatio ratio={16 / 9} className="bg-muted">
										<Image
											src={image.publicUrl}
											alt={image.name}
											fill
											className="object-cover rounded-t-lg"
										/>
									</AspectRatio>
									<div className="p-4 space-y-3">
										<div>
											<p
												className="text-sm font-medium truncate"
												title={image.name}
											>
												{image.name}
											</p>
											<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
												{image.size && (
													<span>{formatFileSize(image.size)}</span>
												)}
												{image.size && image.createdAt && <span>•</span>}
												{image.createdAt && (
													<span>{formatDate(image.createdAt)}</span>
												)}
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex gap-2">
												<Input
													value={image.publicUrl}
													readOnly
													className="text-xs"
													onClick={(e) => e.currentTarget.select()}
												/>
												<Button
													size="icon"
													variant="outline"
													onClick={() => handleCopyUrl(image.publicUrl)}
													title="Copy URL"
												>
													<CopyIcon className="h-4 w-4" />
												</Button>
											</div>

											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													className="flex-1"
													onClick={() => window.open(image.publicUrl, "_blank")}
												>
													<ExternalLinkIcon className="h-4 w-4 mr-2" />
													View
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => setDeleteTarget(image.name)}
												>
													<TrashIcon className="h-4 w-4 mr-2" />
													Delete
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Image?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. The image will be permanently
							deleted from storage.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
