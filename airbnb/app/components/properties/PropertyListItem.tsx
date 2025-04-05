import React from "react";
import Image from "next/image";
import { PropertyType } from "./PropertyList";
import { useRouter } from "next/navigation";
interface PropertyProps {
  property: PropertyType;
}
const PropertyListItem: React.FC<PropertyProps> = ({property}) => {
  return (
    <div className="cursor-pointer">
      {/* ImageCard */}
      <div className="relative overflow-hidden aspect-square rounded-xl">
        <Image
          fill
          src={property.image_url}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Fixed sizes
          className="hover:scale-110 object-cover transition h-full w-full"
          alt="Beach house"
          priority
        />
      </div>
      {/* Property Name */}
      <div className="mt-2">
        <p className="text-md font-semibold">{property.title}</p>
      </div>

      {/* Price Property */}
      <div className="mt-1">
        <p className="text-sm text-gray-700">
          <strong>${property.price_per_night}</strong> per night
        </p>
      </div>
    </div>
  );
};

export default PropertyListItem;
