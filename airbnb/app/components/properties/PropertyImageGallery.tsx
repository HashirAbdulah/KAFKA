"use client";

import Image from "next/image";
import { PropertyType } from "@/app/types";

interface PropertyImageGalleryProps {
  images: PropertyType[];
  propertyTitle: string;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  propertyTitle,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative aspect-square rounded-lg overflow-hidden"
        >
          <Image
            src={image.image_url}
            alt={`${propertyTitle} - Image ${index + 1}`}
            fill
            className="object-cover hover:opacity-90 transition-opacity cursor-pointer"
            onClick={() => {
              // TODO: Implement image gallery modal
              console.log("Open image gallery");
            }}
          />
          {image.is_primary && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              Primary
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PropertyImageGallery;
