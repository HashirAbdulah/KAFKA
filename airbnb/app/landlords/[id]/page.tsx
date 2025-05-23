// // import Image from "next/image";
// import PropertyList from "@/app/components/properties/PropertyList";
// import ContactButton from "@/app/components/ContactButton";
// import apiService from "@/app/services/apiService";
// import { getUserId } from "@/app/lib/action";
// import { notFound } from "next/navigation";
// import Image from 'next/image';  // Correct import

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// const LandlordDetailPage = async ({ params }: PageProps) => {
//   try {
//     const resolvedParams = await Promise.resolve(params);
//     const landlord = await apiService.get(
//       `/api/auth/landlord/${resolvedParams.id}`
//     );
//     const userId = await getUserId();

//     return (
//       <main className="max-w-[1650px] mx-auto px-6 mt-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <aside className="col-span-1 mb-4">
//             <div className="flex flex-col items-center rounded-xl p-6 border border-gray-300 shadow-xl">
//               <div className="w-48 h-48 overflow-hidden rounded-full">
//                 <Image
//                   src={
//                     landlord.profile_image
//                       ? `${process.env.NEXT_PUBLIC_API_HOST}${landlord.profile_image}`
//                       : "/default-avatar.png"
//                   }
//                   alt={landlord.name}
//                   width={200}
//                   height={200}
//                   className="object-cover"
//                   priority
//                 />
//               </div>

//               <h1 className="mt-6 text-2xl font-semibold">{landlord.name}</h1>
//               {userId != resolvedParams.id && (
//                 <ContactButton userId={userId} landlordId={resolvedParams.id} />
//               )}
//             </div>
//           </aside>

//           <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <PropertyList landlord_id={resolvedParams.id} />
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   } catch (error) {
//     console.error("Error fetching landlord details:", error);
//     notFound();
//   }
// };

// export default LandlordDetailPage;
// import Image from "next/image";
import PropertyList from "@/app/components/properties/PropertyList";
import ContactButton from "@/app/components/ContactButton";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/action";
import { notFound } from "next/navigation";
import Image from 'next/image';  // Correct import

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const LandlordDetailPage = async ({ params }: PageProps) => {
  try {
    const resolvedParams = await params;
    const landlord = await apiService.get(
      `/api/auth/landlord/${resolvedParams.id}`
    );
    const userId = await getUserId();
    return (
      <main className="max-w-[1650px] mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <aside className="col-span-1 mb-4">
            <div className="flex flex-col items-center rounded-xl p-6 border border-gray-300 shadow-xl">
              <div className="w-48 h-48 overflow-hidden rounded-full">
                <Image
                  src={
                    landlord.profile_image
                      ? `${process.env.NEXT_PUBLIC_API_HOST}${landlord.profile_image}`
                      : "/default-avatar.png"
                  }
                  alt={landlord.name}
                  width={200}
                  height={200}
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="mt-6 text-2xl font-semibold">{landlord.name}</h1>
              {userId != resolvedParams.id && (
                <ContactButton userId={userId} landlordId={resolvedParams.id} />
              )}
            </div>
          </aside>
          <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PropertyList landlord_id={resolvedParams.id} />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching landlord details:", error);
    notFound();
  }
};

export default LandlordDetailPage;
