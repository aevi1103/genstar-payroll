"use client";

import { uploadImage } from "@/app/payroll/settings/images/actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState, useRef, type ChangeEvent } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif",
];

export function ImageUploadForm({
	onUploadSuccess,
}: { onUploadSuccess?: () => void } = {}) {
	const [preview, setPreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		processFile(selectedFile);
	};

	const processFile = (selectedFile: File | undefined) => {
		if (!selectedFile) return;

		// Validate file type
		if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
			toast.error(
				"Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
			);
			return;
		}

		// Validate file size
		if (selectedFile.size > MAX_FILE_SIZE) {
			toast.error("File size exceeds 5MB limit.");
			return;
		}

		setFile(selectedFile);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(selectedFile);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const droppedFile = e.dataTransfer.files?.[0];
		processFile(droppedFile);
	};

	const handleClear = () => {
		setFile(null);
		setPreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!file) {
			toast.error("Please select an image to upload.");
			return;
		}

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const result = await uploadImage(formData);

			if (result.success && result.publicUrl) {
				toast.success("Image uploaded successfully!", {
					description: "Your image is now available in the public storage.",
				});
				handleClear();
				onUploadSuccess?.();
			} else {
				toast.error(result.error || "Failed to upload image");
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upload Image</CardTitle>
				<CardDescription>
					Upload images for the public site. Max size: 5MB. Supported formats:
					JPEG, PNG, WebP, GIF
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* File Input / Drop Zone */}
					<div className="space-y-2">
						<Label htmlFor="file-upload">Image File</Label>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={cn(
								"relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
								isDragging
									? "border-primary bg-primary/5"
									: "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
							)}
						>
							{preview ? (
								<div className="relative w-full h-full p-4">
									<Image
										src={preview}
										alt="Preview"
										fill
										className="object-contain rounded-lg"
									/>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="absolute top-2 right-2"
										onClick={(e) => {
											e.stopPropagation();
											handleClear();
										}}
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<UploadIcon className="w-10 h-10 mb-3 text-muted-foreground" />
									<p className="mb-2 text-sm text-muted-foreground">
										<span className="font-semibold">Click to upload</span> or
										drag and drop
									</p>
									<p className="text-xs text-muted-foreground">
										JPEG, PNG, WebP, or GIF (max 5MB)
									</p>
								</div>
							)}
							<Input
								ref={fileInputRef}
								id="file-upload"
								type="file"
								accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
								onChange={handleFileChange}
								className="sr-only"
							/>
						</div>
					</div>

					{/* File Info */}
					{file && (
						<div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
							<ImageIcon className="h-8 w-8 text-muted-foreground" />
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">{file.name}</p>
								<p className="text-xs text-muted-foreground">
									{(file.size / 1024).toFixed(2)} KB
								</p>
							</div>
						</div>
					)}

					{/* Submit Button */}
					<div className="flex justify-end gap-3">
						{file && (
							<Button
								type="button"
								variant="outline"
								onClick={handleClear}
								disabled={isUploading}
							>
								Clear
							</Button>
						)}
						<Button type="submit" disabled={!file || isUploading}>
							{isUploading ? "Uploading..." : "Upload Image"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
