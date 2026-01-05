"use client";

import { useState, useRef } from "react";
import { Images as ImagesIcon } from "lucide-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
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
import type { PublicImages } from "@/lib/db/get-public-images";

export function ImagesSection({ images }: { images: PublicImages }) {
	const [selectedImage, setSelectedImage] = useState<
		NonNullable<PublicImages>[number] | null
	>(null);

	const autoplayPlugin = useRef(
		Autoplay({ delay: 2000, stopOnInteraction: false }),
	);

	if (images?.length === 0) {
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
						plugins={[autoplayPlugin.current]}
						className="w-full"
						onMouseEnter={() => autoplayPlugin.current.stop()}
						onMouseLeave={() => autoplayPlugin.current.play()}
					>
						<CarouselContent className="-ml-4">
							{images?.map((image) => (
								<CarouselItem
									key={image.name}
									className="pl-4 md:basis-1/2 lg:basis-1/3"
								>
									<div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
										<div
											className="cursor-pointer"
											onClick={() => setSelectedImage(image)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													setSelectedImage(image);
												}
											}}
										>
											{/* Image Container */}
											<AspectRatio ratio={4 / 3} className="bg-muted">
												<Image
													src={image?.publicUrl}
													alt={`Gallery image ${image.name}`}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-110"
													sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
												/>
												{/* Overlay on hover */}
												<div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors duration-300" />
											</AspectRatio>
										</div>
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
				<DialogContent
					className="h-[85vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] 
        max-w-[95vw] sm:max-w-[90vw] md:max-w-[92vw] lg:max-w-[95vw] p-0 border-0
         overflow-hidden rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-xl"
				>
					<DialogHeader className="sr-only">
						<DialogTitle className="text-emerald-950">
							Image Preview
						</DialogTitle>
						<DialogDescription className="text-emerald-900/70">
							Gallery Image
						</DialogDescription>
					</DialogHeader>
					{selectedImage && (
						<div className="relative w-full h-full flex items-center justify-center bg-transparent backdrop-blur-sm">
							<Image
								src={selectedImage.publicUrl}
								alt="Gallery preview"
								fill
								className="object-contain"
								sizes="(max-width: 640px) 95vw, 90vw"
								priority
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
