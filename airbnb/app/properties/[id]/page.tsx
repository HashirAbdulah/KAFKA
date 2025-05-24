import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import PropertyImageCarousel from "@/app/components/properties/PropertyImageCarousel";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const response = await apiService.getPublic(`/api/properties/${id}`);
  const property = response.property;
  const userId = await getUserId();

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6">
      {/* Image Section */}
      <div className="mb-6">
        <PropertyImageCarousel
          images={property.images}
          propertyTitle={property.title}
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
            <div className="relative w-9 h-9">
              {" "}
              {/* Fixed width and height */}
              <Image
                priority
                src={
                  property.landlord.profile_image
                    ? `${process.env.NEXT_PUBLIC_API_HOST}${property.landlord.profile_image}`
                    : "/profile_pic_1.jpg"
                }
                alt={property.landlord.name}
                height={50}
                width={50}
                className="rounded-full border-2 border-white shadow-md object-cover transition-transform hover:scale-105"
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
