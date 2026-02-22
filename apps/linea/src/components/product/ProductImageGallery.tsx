import type { ProductImage } from "@commercengine/storefront-sdk";
import type * as React from "react";
import { useRef, useState } from "react";
import ImageZoom from "./ImageZoom";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const imageUrls = images.map((img) => img.url_zoom || img.url_standard);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = (index: number) => {
    setZoomInitialIndex(index);
    setIsZoomOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted/10 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No images</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop: Vertical scrolling gallery */}
      <div className="hidden lg:block">
        <div className="space-y-4">
          {images.map((image, index) => {
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(index);
              }
            };
            return (
              <button
                key={image.id}
                type="button"
                className="w-full aspect-square overflow-hidden cursor-pointer group border-0 p-0 bg-transparent"
                onClick={() => handleImageClick(index)}
                onKeyDown={handleKeyDown}
                aria-label={`View ${productName} image ${index + 1}`}
              >
                <img
                  src={image.url_standard}
                  alt={image.alternate_text || `${productName} view ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tablet/Mobile: Image slider */}
      <div className="lg:hidden">
        <div className="relative">
          <button
            type="button"
            className="w-full aspect-square overflow-hidden cursor-pointer group touch-pan-y border-0 p-0 bg-transparent"
            onClick={() => handleImageClick(currentImageIndex)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(currentImageIndex);
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label={`View ${productName} image ${currentImageIndex + 1}`}
          >
            <img
              src={images[currentImageIndex].url_standard}
              alt={
                images[currentImageIndex].alternate_text ||
                `${productName} view ${currentImageIndex + 1}`
              }
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-foreground" : "bg-muted"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoom
        images={imageUrls}
        initialIndex={zoomInitialIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
};

export default ProductImageGallery;
