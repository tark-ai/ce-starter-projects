import { X } from "lucide-react";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ImageZoomProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageZoom = ({ images, initialIndex, isOpen, onClose }: ImageZoomProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Scroll to the selected image when modal opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const imageElement = scrollRef.current.children[0]?.children[initialIndex] as HTMLElement;
      if (imageElement) {
        imageElement.scrollIntoView();
      }
    }
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const handleBackdropKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 border-0 p-0 cursor-pointer bg-transparent"
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
        aria-label="Close image zoom"
      />

      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-6 right-6 z-10 hover:bg-transparent text-black border-none p-2"
      >
        <X className="h-8 w-8" />
      </Button>

      {/* Scrollable image container */}
      <div ref={scrollRef} className="relative w-full h-full overflow-y-auto">
        <div className="space-y-4">
          {images.map((image) => (
            <div key={image} className="w-full flex justify-center">
              <img
                src={image}
                alt="Product view"
                className="w-full max-w-none object-cover animate-scale-in"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageZoom;
