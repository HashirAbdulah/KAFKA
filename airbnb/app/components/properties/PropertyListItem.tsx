"use client";
import Image from "next/image";
import { PropertyListType } from "./PropertyList";
import { useRouter } from "next/navigation";
import FavouriteButton from "../FavouriteButton";
import useEditPropertyModal from "@/app/hooks/useEditPropertyModal";
import { useEffect, useState, useCallback } from "react";
import { getUserId } from "@/app/lib/action";
import DeletePropertyModal from "../modals/DeletePropertyModal";

interface PropertyProps {
  property: PropertyListType;
  markFavourite?: (is_favourite: boolean) => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({
  property,
  markFavourite,
  onUpdate,
  onDelete,
}) => {
  const router = useRouter();
  const editPropertyModal = useEditPropertyModal();
  const [isLandlord, setIsLandlord] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const checkLandlord = async () => {
      const userId = await getUserId();
      setIsLandlord(userId === property.landlord_id);
    };
    checkLandlord();
  }, [property.landlord_id]);

  const handlePropertyEdit = useCallback(() => {
    editPropertyModal.open(property);
    // Register a callback to be called when the property is updated
    editPropertyModal.setOnSuccess = () => {
      // Trigger refresh
      if (onUpdate) onUpdate();
      router.refresh();
    };
  }, [property, editPropertyModal, onUpdate, router]);

  const handlePropertyDelete = useCallback(() => {
    setShowDeleteModal(false);
    // Trigger refresh after deletion
    if (onDelete) onDelete();
    router.refresh();
  }, [onDelete, router]);

  return (
    <>
      <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
        <div
          onClick={() => router.push(`/properties/${property.id}`)}
          className="cursor-pointer"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10]">
            <Image
              fill
              src={property.primary_image_url || "/beach_img.jpg"}
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
            id={property.id.toString()}
            is_favourite={property.is_favourite}
            markFavourite={markFavourite || (() => {})}
          />
          {isLandlord && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handlePropertyEdit}
                className="min-w-[120px] flex-1 sm:flex-none cursor-pointer px-3 py-2 text-sm text-center text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-300 ease-in-out active:scale-95"
                aria-label="Edit Property"
              >
                <span className="flex items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="min-w-[120px] flex-1 sm:flex-none cursor-pointer px-3 py-2 text-sm text-center text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-300 ease-in-out active:scale-95"
                aria-label="Delete Property"
              >
                <span className="flex items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
      <DeletePropertyModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        propertyId={property.id.toString()}
        propertyTitle={property.title}
        onDelete={handlePropertyDelete}
      />
    </>
  );
};

export default PropertyListItem;
