import React from 'react'
import Image from "next/image";
import PropertyList from "@/app/components/properties/PropertyList";
import ContactButton from '@/app/components/ContactButton';
const LandlordDetailPage = () => {
  return (
    <main className='max-w-screen-xl mx-auto px-6 mb-6 mt-4'>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="col-span-1 mb-4">
          <div className="flex flex-col items-center rounded-xl p-6 border border-gray-300 shadow-xl">
            <Image
              src='/profile_pic_1.jpg'
              width={200}
              height={200}
              alt="landlord name"
              className="rounded-full"
            />
            <h1 className="mt-6">HOST</h1>
            <ContactButton />
          </div>
        </aside>

        <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PropertyList />
          </div>
        </div>
      </div>
    </main>
  )
}

export default LandlordDetailPage;
