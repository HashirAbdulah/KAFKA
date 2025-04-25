"use client";
import Image from "next/image";
import { PropertyType } from "./PropertyList";
import { useRouter } from "next/navigation";
import FavouriteButton from "../FavouriteButton";
import useEditPropertyModal from "@/app/hooks/useEditPropertyModal";
import { useEffect, useState } from "react";
import { getUserId } from "@/app/lib/action";

interface PropertyProps {
  property: PropertyType;
  markFavourite?: (is_favourite: boolean) => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({
  property,
  markFavourite,
}) => {
  const router = useRouter();
  const editPropertyModal = useEditPropertyModal();
  const [isLandlord, setIsLandlord] = useState(false);

  useEffect(() => {
    const checkLandlord = async () => {
      const userId = await getUserId();
      setIsLandlord(userId === property.landlord_id);
    };
    checkLandlord();
  }, [property.landlord_id]);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div
        onClick={() => router.push(`/properties/${property.id}`)}
        className="cursor-pointer"
      >
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10]">
          <Image
            fill
            src={property.image_url || "/beach_img.jpg"}
            alt={property.title}
            className="object-cover group-hover:opacity-95 transition"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority
          />
        </div>
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="text-base sm:text-lg font-semibold line-clamp-1 mb-1">
            {property.title}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            ${property.price_per_night} per night
          </p>
        </div>
      </div>
      <div className="p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100">
        <FavouriteButton
          id={property.id}
          is_favourite={property.is_favourite}
          markFavourite={markFavourite || (() => {})}
        />
        {isLandlord && (
          <button
            onClick={() => editPropertyModal.open(property)}
            className="w-full sm:w-auto cursor-pointer px-4 py-2 text-sm sm:text-base text-center text-white bg-[#ff385c] rounded-lg transition duration-300 ease-in-out hover:bg-[#F4002D] active:scale-95"
          >
            Edit Property
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyListItem;
