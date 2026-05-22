import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/propertyData";

/**
 * Virtual Tour Component - Image Gallery with Lightbox
 * Displays property images with navigation and fullscreen view
 */

interface VirtualTourProps {
  property: Property;
}

export default function VirtualTour({ property }: VirtualTourProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Use uploaded images if available, otherwise fallback to static image + stock photos
  const tourImages = property.images && property.images.length > 0 
    ? property.images 
    : [
        property.image,
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663490327936/TzN54ThndsQfyZ4yvrXWYy/pg-green-valley-1-7fFHisRX8apqHrUeJjEWQf.webp",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663490327936/TzN54ThndsQfyZ4yvrXWYy/pg-cozy-corner-1-B4ojrtmXP7hE9sb9DRVPhK.webp",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663490327936/TzN54ThndsQfyZ4yvrXWYy/pg-modern-living-1-9AQQVbPPb2dJ9Q96wtZ2oz.webp",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663490327936/TzN54ThndsQfyZ4yvrXWYy/pg-student-haven-1-Mx6uVNrna9HXZzEJ5RViiK.webp",
      ].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative bg-muted rounded-2xl overflow-hidden">
        {/* Main Image */}
        <div className="relative h-96 bg-muted overflow-hidden">
          <img
            src={tourImages[currentImageIndex]}
            alt={`${property.name} - View ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-all z-10"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-foreground" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {tourImages.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 p-4 bg-background overflow-x-auto">
          {tourImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Image Info */}
        <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
          <p className="text-sm font-semibold text-foreground mb-2">
            {property.images && property.images.length > 0 
              ? `Photo ${currentImageIndex + 1}` 
              : ["Bedroom", "Common Area", "Kitchen", "Bathroom", "Balcony"][currentImageIndex]}
          </p>
          <p className="text-xs text-muted-foreground">
            {property.images && property.images.length > 0 
              ? `View of ${property.name}` 
              : ["Spacious bedroom with natural light", "Comfortable common area for residents", "Well-equipped kitchen", "Modern bathroom facilities", "Scenic balcony view"][currentImageIndex]}
          </p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Fullscreen Image */}
            <img
              src={tourImages[currentImageIndex]}
              alt={`${property.name} - Fullscreen`}
              className="w-full h-full object-contain"
            />

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {tourImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
