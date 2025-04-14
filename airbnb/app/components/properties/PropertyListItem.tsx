import Image from "next/image";
import { PropertyType } from "./PropertyList";
import { useRouter } from "next/navigation";
import FavouriteButton from "../FavouriteButton";

interface PropertyProps {
  property: PropertyType;
  markFavourite?: (is_favourite: boolean) => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({ property, markFavourite }) => {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/properties/${property.id}`)}
    >
      {/* ImageCard WITH RELATIVE POSITIONING */}
      <div className="relative overflow-hidden aspect-square rounded-xl">
        <Image
          fill
          src={property.image_url}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="hover:scale-110 object-cover transition h-full w-full"
          alt="Beach house"
          priority
        />

        {/* Property Favourite button INSIDE the image container */}
        {markFavourite && (
          <div className="absolute top-2 right-2 z-10">
            <FavouriteButton
              id={property.id}
              is_favourite={property.is_favourite || false}
              markFavourite={markFavourite}
            />
          </div>
        )}
      </div>

      {/* Property info go here */}
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
