import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import apiService from "@/app/services/apiService";
// import { useRouter } from 'next/router'
interface PropertyDetailPageProps {
  params: { id: string };
}
const PropertyDetailPage = async ({params}:{params: {id:string}}) => {
  const property = await apiService.get(`/api/properties/${params.id}`);
  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6">
      {/* Image Section */}
      <div className="mb-6 w-full h-[64vh] overflow-hidden rounded-xl relative">
        <Image
          priority
          fill
          src="/beach_img.jpg"
          className="object-cover"
          alt="Beach Image"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="pr-6 col-span-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Property  {property.title}
          </h1>
          <span className="mb-4 block text-lg text-gray-600">
            2 Guests - 2 Bedrooms - 2 Bathrooms
          </span>
          <hr className="border-gray-300 mb-6" />

          {/* Profile Picture and Info */}
          <Link href="#" className="py-4 flex items-center space-x-4">
            <div className="relative">
              <Image
                priority
                src="/profile_pic_1.jpg"
                alt="Profile"
                height={50}
                width={50}
                className="rounded-full border-2 border-white shadow-md transition-transform hover:scale-105"
              />
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">
                <strong>Host</strong> - is your Host
              </p>
              <p className="text-xs text-gray-500">Host Description or Info</p>
            </div>
          </Link>
          {/* Property Description */}
          <div className="mt-6 text-lg text-gray-700">
            <p>
              Property description Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Maxime nulla reiciendis voluptate quam, sit
              quasi illo labore consectetur ipsum vel ratione incidunt!
            </p>
          </div>
        </div>

        {/* Reservation Sidebar */}
        <ReservationSidebar />
      </div>
    </main>
  );
};

export default PropertyDetailPage;
