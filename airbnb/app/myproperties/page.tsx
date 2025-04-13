import PropertyList from "../components/properties/PropertyList";
import { getUserId } from "../lib/action";
const MyPropertiesPage = async () => {
  const userId = await getUserId();
  return (
    <main className="max-w-screen-xl mx-auto px-6 mb-6 mt-4">
            <h1 className="my-4 text-2xl">My Properties</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PropertyList
                    landlord_id={userId}
                    />
            </div>
    </main>
  )
}

export default MyPropertiesPage;
