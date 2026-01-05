"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Images as ImagesIcon, Sparkles, ImageIcon } from "lucide-react";
import { listImages } from "@/app/payroll/settings/images/actions";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageFile {
	name: string;
	publicUrl: string;
	createdAt: string;
	size: number;
}

export function ImagesSection(): React.ReactElement | null {
	const [images, setImages] = useState<ImageFile[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);

	useEffect(() => {
		const fetchImages = async () => {
			setLoading(true);
			try {
				const result = await listImages();
				if (result.success && result.files) {
					setImages(result.files);
				}
			} catch (error) {
				console.error("Error fetching images:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchImages();
	}, []);

	if (loading) {
		return (
			<section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:py-32">
				<div className="text-center">
					<div className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-100 to-emerald-50 px-4 sm:px-6 py-2.5 sm:py-3 ring-1 ring-emerald-200 animate-pulse">
						<ImagesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
						<span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-700">
							Loading Gallery
						</span>
					</div>
				</div>
			</section>
		);
	}

	if (images.length === 0) {
		return null;
	}

	return (
		<>
			<section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:py-32">
				{/* Decorative background elements */}
				<div className="absolute inset-0 -z-10 overflow-hidden">
					<div className="absolute top-20 left-10 h-80 w-80 rounded-full bg-emerald-100/20 blur-3xl" />
					<div className="absolute bottom-40 right-20 h-96 w-96 rounded-full bg-blue-100/15 blur-3xl" />
				</div>

				{/* Header */}
				<div className="mb-12 sm:mb-16 md:mb-20 text-center">
					<div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-100 to-emerald-50 px-4 sm:px-6 py-2.5 sm:py-3 ring-1 ring-emerald-200">
						<ImagesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
						<span
							id="gallery"
							className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-700"
						>
							Our Gallery
						</span>
					</div>
					<h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-emerald-950">
						See Our Work in{" "}
						<span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
							Action
						</span>
					</h2>
					<p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-emerald-900/70">
						Explore our portfolio of premium printing projects that showcase our
						commitment to quality and excellence.
					</p>
				</div>

				{/* Carousel */}
				<div className="mx-auto max-w-5xl px-8 sm:px-12">
					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-4">
							{images.map((image) => (
								<CarouselItem
									key={image.name}
									className="pl-4 md:basis-1/2 lg:basis-1/3"
								>
									<div
										className="group relative cursor-pointer transition-all duration-500
                    "
										onClick={() => setSelectedImage(image)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												setSelectedImage(image);
											}
										}}
									>
										{/* Decorative gradient overlay */}
										{/* <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 via-transparent to-teal-500/0 group-hover:from-emerald-500/15 group-hover:to-teal-500/15 transition-all duration-500 pointer-events-none z-10 rounded-2xl" />
										<div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl group-hover:bg-emerald-400/40 transition-all duration-500 pointer-events-none" />
										<div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl group-hover:bg-teal-400/40 transition-all duration-500 pointer-events-none" /> */}

										{/* Image Container */}
										<AspectRatio
											ratio={16 / 9}
											className="bg-muted rounded-lg overflow-hidden"
										>
											<Image
												src={image.publicUrl}
												alt={`Gallery image ${image.name}`}
												fill
												className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
												sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
											/>
										</AspectRatio>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="border-emerald-200 bg-white/90 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-50" />
						<CarouselNext className="border-emerald-200 bg-white/90 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-50" />
					</Carousel>
				</div>
			</section>

			{/* Image Preview Dialog */}
			<Dialog
				open={selectedImage !== null}
				onOpenChange={(open) => !open && setSelectedImage(null)}
			>
				<DialogContent className="h-[60vh] w-[90vw]! max-w-7xl! p-0 border-0 bg-black/60 backdrop-blur-md">
					<DialogHeader className="sr-only">
						<DialogTitle className="text-emerald-950">
							Image Preview
						</DialogTitle>
						<DialogDescription className="text-emerald-900/70">
							Gallery Image
						</DialogDescription>
					</DialogHeader>
					{selectedImage && (
						<div
							className="relative w-full h-full rounded-lg
             overflow-hidden flex items-center justify-center p-6"
						>
							{/* Image container with blend */}
							<div className="relative w-full h-full">
								<Image
									src={selectedImage.publicUrl}
									alt="Gallery preview"
									fill
									className="object-contain drop-shadow-2xl"
									sizes="98vw"
									priority
								/>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
