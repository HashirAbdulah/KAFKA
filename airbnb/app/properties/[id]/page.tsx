import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/action";

interface PageProps {
  params: {
    id: string;
  };
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  const response = await apiService.get(`/api/properties/${id}`);
  const property = response.property;
  const userId = await getUserId();

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6">
      {/* Image Section */}
      <div className="mb-6 w-full h-[64vh] overflow-hidden rounded-xl relative">
        <Image
          priority
          fill
          src={property.image_url || "/beach_img.jpg"}
          className="object-cover"
          alt={property.title || "Property Image"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {property.title}
          </h1>
          <span className="mb-4 block text-lg text-gray-600">
            {property.guests} Guests - {property.bedrooms} Bedrooms -{" "}
            {property.bathrooms} Bathrooms
          </span>
          <hr className="border-gray-300 mb-6" />
          {/* Profile Picture and Info */}
          <Link
            href={`/landlords/${property.landlord.id}`}
            className="py-4 flex items-center space-x-4"
          >
            <div className="relative">
              <Image
                priority
                src={
                  property.landlord.profile_image_url || "/profile_pic_1.jpg"
                }
                alt={property.landlord.name}
                height={50}
                width={50}
                className="rounded-full border-2 border-white shadow-md transition-transform hover:scale-105"
              />
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">
                <strong>{property.landlord.name}</strong> - is your Host
              </p>
              <p className="text-xs text-gray-500">{property.landlord.email}</p>
            </div>
          </Link>
          {/* Property Description */}
          <div className="mt-6 text-lg text-gray-700">
            <p>{property.description}</p>
          </div>
        </div>
        {/* Reservation Sidebar */}
        <div className="md:col-span-2">
          <div className="sticky top-6">
            <ReservationSidebar property={property} userId={userId} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
