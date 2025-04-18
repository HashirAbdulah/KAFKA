import Image from "next/image";
import PropertyList from "@/app/components/properties/PropertyList";
import ContactButton from '@/app/components/ContactButton';
import apiService from '@/app/services/apiService';
import { getUserId } from "@/app/lib/action";
interface PageProps {
  params: {
    id: string;
  };
}
const LandlordDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await Promise.resolve(params);
  // Get landlord data directly from the API response
  const landlord = await apiService.get(`/api/auth/${resolvedParams.id}`);
  const userId = await getUserId();
  // Add console logging to debug response structure
  console.log("Landlord data:", landlord);

  // Extract username from email if name is null
  const getDisplayName = () => {
    if (landlord.name) return landlord.name;
    if (landlord.email) {
      return landlord.email.split('@')[0] || "Anonymous Host";
    }
    return "Anonymous Host";
  };

  return (
    <main className='max-w-screen-xl mx-auto px-6 mb-6 mt-4'>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="col-span-1 mb-4">
          <div className="flex flex-col items-center rounded-xl p-6 border border-gray-300 shadow-xl">
            <Image
              src={landlord.profile_image_url || "/profile_pic_1.jpg"}
              width={200}
              height={200}
              alt={getDisplayName()}
              className="rounded-full"
              priority
            />
            <h1 className="mt-6">{landlord.name || "Unnamed Host"}</h1>
            {userId != resolvedParams.id && (
            <ContactButton
            userId = {userId}
            landlordId = {resolvedParams.id}
            />
          )}
          </div>
        </aside>

        <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PropertyList
            landlord_id = {resolvedParams.id}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default LandlordDetailPage;
