"use client";

import { useLocationDialogStore } from "@/lib/stores/location-dialog-store";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";

export const UserLocationDialog = () => {
	const { isOpen, latitude, longitude, closeDialog } = useLocationDialogStore();

	const googleMapsUrl =
		latitude && longitude
			? `https://www.google.com/maps?q=${latitude},${longitude}`
			: "";

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<MapPin className="h-5 w-5" />
						GPS Location
					</DialogTitle>
					<DialogDescription>
						View the location where the employee clocked in/out
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Coordinates Display */}
					<div className="rounded-md border p-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Latitude
								</p>
								<p className="text-lg font-mono">{latitude?.toFixed(6)}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Longitude
								</p>
								<p className="text-lg font-mono">{longitude?.toFixed(6)}</p>
							</div>
						</div>
					</div>

					{/* Map Embed */}
					{latitude && longitude && (
						<div className="relative aspect-video w-full overflow-hidden rounded-md border">
							<iframe
								title="Location Map"
								width="100%"
								height="100%"
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`}
							/>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={closeDialog}>
							Close
						</Button>
						{googleMapsUrl && (
							<Button asChild>
								<a
									href={googleMapsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2"
								>
									Open in Google Maps
									<ExternalLink className="h-4 w-4" />
								</a>
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
